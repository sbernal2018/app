const admin = require('firebase-admin');

admin.initializeApp({
  credential: "1234567890",
  databaseURL: "1234567890"
});

console.log("Firebase Admin Initialized!");

module.exports = admin;
