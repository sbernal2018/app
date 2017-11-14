const path = require('path');
const exphbs  = require('express-handlebars');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
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
    const { query } = req.params;
});

// Company name and information, all rendered in individual pages
app.get('/company/:query', (req, res) => {
    const { query } = req.params;
});

// Private admin page. Requires hard-coded admin password
app.get('/admin', (req, res) => {
  
});

// 404 Handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.send(err || 500);
});
