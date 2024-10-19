const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');

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
  
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error in verifyEmail:', error); 
      res.status(500).json({
        success: false,
        message: 'Server Error',
      });
    }
  };