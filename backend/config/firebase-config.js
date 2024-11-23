  const admin = require("firebase-admin");

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(require("./serviceAccountKey.json")), // Path to your service account file
    });
  }

  module.exports = admin;
