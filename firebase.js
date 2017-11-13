const firebase = require("firebase");
const path = require('path');

var serviceAccount = require(path.join(__dirname, 'public/serviceAccountKey.json'));

var config = {
  apiKey: "<API_KEY>",
  authDomain: "<PROJECT_ID>.firebaseapp.com",
  databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
  storageBucket: "<BUCKET>.appspot.com",
};

firebase.initializeApp(config);

module.exports = firebase;
