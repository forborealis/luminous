const User = require('../models/user');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, contactNumber, address, password, avatar } = req.body;

    // Check if avatar is present
    if (!avatar) {
      console.error('No avatar uploaded');
      return res.status(400).json({ success: false, message: 'No avatar uploaded' });
    }

    console.log('Avatar received:', avatar);

    // Upload avatar to Cloudinary
    const result = await cloudinary.uploader.upload(avatar, {
      folder: 'avatars',
      width: 150,
      crop: 'scale'
    });

    console.log('Cloudinary upload result:', result);

    const user = await User.create({
      name,
      email,
      contactNumber,
      address,
      password,
      avatar: {
        public_id: result.public_id,
        url: result.secure_url
      },
      status: 'Pending' 
    });

    // Generate verification token
    const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send verification email
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/verify-email?token=${verificationToken}`;
    const message = `
      <div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333;">Good day, ${name}!</h2>
        <p style="color: #555;">Just click the button below to finish verifying your account.</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Verify Account</a>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Email Verification',
      html: message,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Error in registerUser:', error); 
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.verifyEmail = async (req, res) => {
    try {
      const { token } = req.query;
  
      if (!token) {
        return res.status(400).json({ success: false, message: 'Invalid or missing token' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      user.status = 'Verified';
      await user.save();
  
      return res.redirect('http://localhost:5173/login'); 
    } catch (error) {
      console.error('Error in verifyEmail:', error); 
      res.status(500).json({
        success: false,
        message: 'Server Error',
      });
    }
  };

  exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if email and password are provided
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
      }
  
      // Find user by email
      const user = await User.findOne({ email }).select('+password');
  
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
  
      // Check if user is verified
      if (user.status !== 'Verified') {
        return res.status(401).json({ success: false, message: 'Your account is not verified' });
      }

      // Check if password matches
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

        // Generate JWT token
        const token = user.getJwtToken();

        res.status(200).json({
          success: true,
          token,
        });
      } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({
          success: false,
          message: 'Server Error',
        });
      }
    };

    exports.getUserProfile = async (req, res) => {
      try {
        const userId = req.user.id; 
        const user = await User.findById(userId).select('-password'); 
    
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
    
        res.json({ success: true, user });
      } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, message: 'Server error' });
      }
    };

    
    exports.updateUserProfile = async (req, res) => {
      try {
        const userId = req.user.id; 
        const { email, name, contactNumber, address, avatar } = req.body;
    
        console.log('User ID:', userId); 
        console.log('Request Body:', req.body); 
    
        const user = await User.findById(userId);
    
        if (!user) {
          console.error('User not found'); 
          return res.status(404).json({ success: false, message: 'User not found' });
        }
    
        // Update user details
        user.email = email;
        user.name = name;
        user.contactNumber = contactNumber;
        user.address = address;
    
        // Handle avatar upload if provided
        if (avatar) {
          // Delete the old avatar from Cloudinary
          if (user.avatar.public_id) {
            await cloudinary.uploader.destroy(user.avatar.public_id);
          }
         // Upload the new avatar to Cloudinary
      const result = await cloudinary.uploader.upload(avatar, {
        folder: 'avatars',
        width: 150,
        crop: 'scale'
      });

      user.avatar = {
        public_id: result.public_id,
        url: result.secure_url
      };
    }

    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateUserPassword = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { currentPassword, newPassword } = req.body;

    console.log('User ID:', userId); 
    console.log('Request Body:', req.body); 

    const user = await User.findById(userId).select('+password');

    if (!user) {
      console.error('User not found'); 
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    // End the session if using sessions
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error ending session:', err);
        }
      });
    }

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};