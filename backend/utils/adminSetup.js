const User = require('../models/user');
const admin = require('firebase-admin'); // Firebase Admin SDK
const bcrypt = require('bcryptjs');

// Initialize Firebase Admin SDK
const serviceAccount = require('../config/serviceAccountKey.json'); // Update the path to your service account file

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const createAdmin = async () => {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'admin123'; // Secure this in production

  try {
    // Check MongoDB for an existing admin
    const existingAdmin = await User.findOne({ email: adminEmail, role: 'Admin' });
    if (existingAdmin) {
      console.log('Admin already exists in MongoDB.');
      return;
    }

    // Check Firebase for an existing admin
    let firebaseAdmin = null;
    try {
      firebaseAdmin = await admin.auth().getUserByEmail(adminEmail);
      console.log('Admin already exists in Firebase.');
    } catch (error) {
      console.log('Admin not found in Firebase. Creating...');
      firebaseAdmin = await admin.auth().createUser({
        email: adminEmail,
        password: adminPassword,
        displayName: 'Admin',
      });
    }

    // Hash the password for MongoDB (optional if not used in auth)
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user in MongoDB
    const newAdmin = new User({
      firebaseUID: firebaseAdmin.uid,
      name: 'Admin',
      username: 'admin',
      email: adminEmail,
      contactNumber: 'N/A', // Provide a default value
      address: 'N/A', // Provide a default value
      avatar: {
        public_id: 'default_public_id', // Provide a default value
        url: 'default_avatar_url', // Provide a default value
      },
      role: 'Admin',
      status: 'Verified',
      password: hashedPassword, // Optional if using Firebase Auth
    });

    await newAdmin.save();
    console.log('Admin account created successfully in MongoDB.');
  } catch (error) {
    console.error('Error during admin setup:', error);
  }
};

module.exports = createAdmin;
