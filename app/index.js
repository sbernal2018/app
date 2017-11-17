const path = require('path');
const express = require('express');
const exphbs  = require('express-handlebars');

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

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Set bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Helpers for interfacing realtime database
function writeCompanyData(companyID, employees, industry, location, imgUrl, description) {
  db.ref('companies/' + companyID).set({
    employees: employees,
    industry: industry,
    location: location,
    imgUrl: imgUrl,
    description: description
  });
}

function writeCompanyEmployees(employeeID, position, profilePic, jobDescription, contact){
  db.ref('employees/' + employeeID).set({
    position: position,
    profilePic: profilePic,
    jobDescription: jobDescription,
    contact: contact,
  });
}

function checkIfCompanyExists(companyID) {
  db.ref("companies/").child(companyID).once('value', function(snapshot) {
    var exists = (snapshot.val() !== null);
    companyExistsCallback(companyID, exists);
  });
}

function companyExistsCallback(companyID, exists) {
  if (exists) {
    //console.log('Company ' + companyID + ' exists!');
    return true;
  } else {
    //console.log('Company ' + companyID + ' does not exist!');
    return false;
  }
}

// Default search directory as index
app.get('/', (req, res) => {
  res.render("index", {
    title: "Search Directory",
  });
});

app.post('/', (req, res) => {
  var company = req.body.company;

  if ( checkIfCompanyExists(company) == false ) {
    res.redirect('/');
  } else {
    res.redirect(`/search/${company}`);
  }
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
    res.render("search", {
      title: `Search - ${query}`,
    });

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

// Employee name and information, all rendered in individual pages
app.get('/profile/:name', (req, res) => {
    const { query } = req.params;

});

// Private admin page. Requires hard-coded admin password
app.get('/admin', (req, res) => {
  var invite_token = req.body.invite_token;

});



// 404 Handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error Handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.send(err || 500);
});


module.exports = app
