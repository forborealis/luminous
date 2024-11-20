const User = require('../models/user');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

exports.registerUser = async (req, res) => {
  try {
    const { firebaseUID, name, username, email, contactNumber, address, avatar, status } = req.body;

    // Check if user already exists
    let user = await User.findOne({ firebaseUID });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Upload avatar to Cloudinary if provided
    let avatarUrl = '';
    let avatarPublicId = '';
    if (avatar) {
      const result = await cloudinary.uploader.upload(avatar, {
        folder: 'avatars',
        width: 150,
        crop: 'scale',
      });
      avatarUrl = result.secure_url;
      avatarPublicId = result.public_id;
    }

    // Create new user
    user = new User({
      firebaseUID,
      name,
      username,
      email,
      contactNumber: contactNumber || 'N/A', // Provide default value if not available
      address: address || 'N/A', // Provide default value if not available
      avatar: {
        public_id: avatarPublicId,
        url: avatarUrl,
      },
      status: status || 'Pending', // Set status to Verified for Google Sign-Up, otherwise Pending
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    });

    // If the status is not Verified (i.e., not Google Sign-Up), send verification email
    if (status !== 'Verified') {
      // Generate verification token
      const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      // Send verification email
      const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/verify-email?token=${verificationToken}`;
      const message = `
        <div>Good day, ${name}! Please verify your email: <a href="${verificationUrl}">Verify</a></div>
      `;
      await sendEmail({
        email: user.email,
        subject: 'Email Verification',
        html: message,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      token, // Send the token in the response
    });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
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
      const { firebaseUID } = req.body;
  
      if (!firebaseUID) {
        return res.status(400).json({ success: false, message: 'Firebase UID is required.' });
      }
  
      console.log("Received Firebase UID:", firebaseUID); // Debugging line
  
      // Check if user exists in MongoDB by Firebase UID
      const user = await User.findOne({ firebaseUID: firebaseUID.trim() }); // Ensure no leading/trailing spaces
  
      if (!user) {
        console.log("User not found for Firebase UID:", firebaseUID); // Debugging line
        return res.status(401).json({ success: false, message: 'User not found' });
      }
  
      if (user.status !== 'Verified') {
        console.log("User is not verified:", firebaseUID); // Debugging line
        return res.status(401).json({ success: false, message: 'Your account is not verified' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
      });
      console.log("Generated JWT token:", token); // Debugging line
  
      // Return token to client
      res.status(200).json({ success: true, token });
    } catch (error) {
      console.error('Error in loginUser:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
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
        const { username, email, name, contactNumber, address, avatar } = req.body;
    
        console.log('User ID:', userId); 
        console.log('Request Body:', req.body); 
    
        const user = await User.findById(userId);
    
        if (!user) {
          console.error('User not found'); 
          return res.status(404).json({ success: false, message: 'User not found' });
        }
    
        // Update user details
        user.username = username;
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

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const now = Date.now();
    if (user.lastPasswordResetRequest && now - user.lastPasswordResetRequest < 60 * 1000) {
      return res.status(429).json({ success: false, message: 'Please wait 60 seconds before requesting another reset email.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = now + 10 * 60 * 1000; // 10 minutes

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    user.lastPasswordResetRequest = now;
    await user.save();

    const message = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
          @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
        </style>
      </head>
      <body class="bg-gray-100">
        <div class="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-bold text-center mb-4">Password Reset Request</h2>
          <p class="text-gray-700 mb-4">
            You are receiving this email because you recently sent a request to reset your password. If this isn't you, please disregard it. The token expires in 10 minutes (don't share it with anyone else).
          </p>
          <div class="text-center">
            <span class="text-xl font-bold text-red-500">${resetToken}</span>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      html: message,
    });

    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    }).select('+password');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({ success: false, message: 'Cannot use current password' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};