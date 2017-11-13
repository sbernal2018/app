require('dotenv').config()
const path = require('path');
const exphbs  = require('express-handlebars');
const express = require('express');
const app = express();

const host = process.env.APP_HOST || '127.0.0.1';
const port = process.env.APP_PORT || 8080;

const firebase = require('./firebase');

// Password for interacting with admin panel
const ADMINISTRATION_PASSWORD = "12345";

// Configuring our Express server!
app.engine('handlebars', exphbs({defaultLayout: 'default'}));
app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, '/views'))
app.use((req, res, next) => {
    next();
});

function writeCompanyData(companyID, name, employees, imageUrl) {
  firebase.database().ref('users/' + companyID).set({
    name: name,
    employees: employees, // array
    profile_picture : imageUrl
  });
}

// Default search directory as index
app.get('/', (req, res) => {
  res.render("index");

});

// Standard static about page
app.get('/about', (req, res) => {
  res.render("about");
});

// Search query to get entries back
app.get('/search/:query', (req, res) => {

});

// Company name and information, all rendered in individual pages
app.get('/company/:query', (req, res) => {

});

// Private admin page. Requires hard-coded admin password
app.get('/admin', (req, res) => {

});


// Setting up an event listener and error handler
app.listen(port, host);
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

console.log(`VEIPlus Server starting on http://${host}:${port}`)
