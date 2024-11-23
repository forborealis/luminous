const User = require('../models/user');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const resetPass = require('../utils/sendEmail');
const admin = require('firebase-admin');


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
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
        </style>
      </head>
      <body class="bg-gray-100">
        <div class="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-bold text-center mb-4">Email Verification</h2>
          <p class="text-gray-700 mb-4">
            Good day, ${name}! To finish setting up your Luminous account, please verify your email first.
          </p>
          <div class="text-center">
            <a href="${verificationUrl}" class="bg-blue-500 text-white px-4 py-2 rounded inline-block">Verify</a>
          </div>
        </div>
      </body>
      </html>
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
      token, 
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
      const { email, password, firebaseUID } = req.body;
  
      // Validate email and password
      if (!email || (!password && !firebaseUID)) {
        return res.status(400).json({ success: false, message: 'Email and password or Firebase UID are required.' });
      }
  
      console.log('Login attempt for email:', email);
  
      // Check Firebase authentication
      const userRecord = await admin.auth().getUserByEmail(email).catch(() => null);
  
      if (!userRecord) {
        console.error('User not found in Firebase.');
        return res.status(404).json({ success: false, message: 'Invalid email or password.' });
      }
  
      const uid = firebaseUID || userRecord.uid;
  
      // Check if the user exists in MongoDB
      let user = await User.findOne({ firebaseUID: uid });
  
      // Create a new user in MongoDB if not found
      if (!user) {
        console.log('User not found in MongoDB. Creating a new user...');
  
        const avatarUrl = userRecord.photoURL || 'default_avatar_url';
  
        user = new User({
          firebaseUID: uid,
          email: userRecord.email,
          username: userRecord.displayName || 'Default Username',
          name: userRecord.displayName || 'User',
          contactNumber: 'N/A',
          address: 'N/A',
          avatar: {
            public_id: 'default_public_id',
            url: avatarUrl,
          },
          status: 'Verified',
          role: 'user',
        });
  
        await user.save();
        console.log('New user created in MongoDB:', user);
      }
  
      // Check if the user is verified
      if (user.status !== 'Verified') {
        console.error('User is not verified:', uid);
        return res.status(401).json({ success: false, message: 'Your account is not verified.' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
      });
  
      console.log(`JWT token generated for ${user.role}:`, token);
  
      // Return the token and role to the client
      res.status(200).json({
        success: true,
        token,
        role: user.role,
      });
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

exports.forgotPassword = async (req, res) =>  {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

    // Update user with reset token and expiration
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

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
            You are receiving this email because you recently sent a request to reset your password. Please click the link below to reset your password:
          </p>
          <div class="text-center">
            <a href="${resetUrl}" class="bg-blue-500 text-white px-4 py-2 rounded inline-block">Reset Password</a>
          </div>
          <p class="text-gray-700 mt-4 text-center">
            If you didn't request this, please disregard this email.
          </p>
        </div>
      </body>
      </html>
    `;

    // Send email via Mailtrap
    await resetPass({
      email,
      subject: 'Password Reset Request',
      html: message,
    });

    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Update password and clear reset token and expiration
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating user password:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getTotalVerifiedUsers = async (req, res) => {
  try {
    const totalVerifiedUsers = await User.countDocuments({ status: 'Verified' });
    res.json({ total: totalVerifiedUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveFcmToken = async (req, res) => {
  try {
    const { firebaseUID, fcmToken } = req.body;

    if (!firebaseUID || !fcmToken) {
      return res.status(400).json({ success: false, message: "Firebase UID and FCM token are required." });
    }

    const user = await User.findOne({ firebaseUID });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Update the user's FCM token
    user.fcmToken = fcmToken;
    await user.save();

    return res.status(200).json({ success: true, message: "FCM token saved successfully." });
  } catch (error) {
    console.error("Error saving FCM token:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};


exports.sendNotification = async (req, res) => {
  try {
    const { firebaseUID, title, body } = req.body;

    // Find the user and their FCM token
    const user = await User.findOne({ firebaseUID });
    if (!user || !user.fcmToken) {
      return res.status(404).json({ success: false, message: "FCM token not found for user." });
    }

    const message = {
      token: user.fcmToken,
      notification: {
        title,
        body,
      },
    };

    // Send the notification via FCM
    const response = await admin.messaging().send(message);
    return res.status(200).json({ success: true, message: "Notification sent successfully.", response });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).json({ success: false, message: "Failed to send notification." });
  }
};