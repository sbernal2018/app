const path = require('path');
const exphbs  = require('express-handlebars');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

const admin = require('./firebase-admin');
const helpers = require('./helpers');

const db = admin.database();

// Configuring our Express server!
app.engine('handlebars', exphbs({
  defaultLayout: 'default',
  helpers: helpers
}));


app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, './../views'))
app.use((req, res, next) => {
    next();
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


function writeCompanyData(companyID, name, employees, imageUrl) {
  db.ref('companies/' + companyID).set({
    name: name,
    employees: employees, // array
    profile_picture : imageUrl
  });
}

// Default search directory as index
app.get('/', (req, res) => {
  res.render("index", {
    title: "Search Directory",
  });
});

// Standard static about page
app.get('/about', (req, res) => {
  res.render("about", {
    title: "About",
  });
});

// Search query to get entries back
app.get('/search/:query', (req, res) => {
    const { query } = req.params;

});

// Company name and information, all rendered in individual pages
app.get('/company/:query', (req, res) => {
    const { query } = req.params;

    var companyRef = db.ref(`companies/${query}`);

    companyRef.on("value", function(snapshot){
      console.log(snapshot.val());
    }, function (error) {
      console.log("Error: " + error.code);
    });

});

app.get('/profile/:name', (req, res) => {
    const { query } = req.params;


});

// Private admin page. Requires hard-coded admin password
app.get('/admin', (req, res) => {
  var invite_token = req.param('invite_token');
});

// API endpoint for retrieving all companies
app.get('/api/companies', (req, res) => {
  var ref = admin.database().ref("/companies");

  ref.once("value", function(userSnapshot) {
    userSnapshot.forEach(function(userSnapshot) {
        res.send(userSnapshot.val());
    });
  });
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


module.exports = app
