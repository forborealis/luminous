const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

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
      }
    });

    // Generate JWT token
    const token = user.getJwtToken();

    return res.status(201).json({
      success: true,
      user,
      token
    });
  } catch (error) {
    console.error('Error in registerUser:', error); // Log the error
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};