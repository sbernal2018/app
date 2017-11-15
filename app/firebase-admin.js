const admin = require("firebase-admin");
const path = require('path');

var serviceAccount = require(path.join(__dirname, '../private/serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://veiplus-96fa7.firebaseio.com"
});

module.exports = admin;
