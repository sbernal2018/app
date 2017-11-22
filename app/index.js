const path = require('path');
const express = require('express');
const exphbs  = require('express-handlebars');
const flash = require('connect-flash');

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

app.use((req, res, next) => {
    //res.locals.messages = req.flash();
    next();
});

app.set('view engine', 'handlebars');

// Set bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('keyboard cat'));
app.use(flash());

// Helpers for interfacing realtime database
function writeCompanyData(query, callback) {
  var companyRef = db.ref('companies/' + query.company);

  companyRef.set({
    employees: query.employees,
    industry: query.industry,
    location: query.location,
    imgUrl: query.imgUrl,
    description: query.description
  });

  callback(NULL, "Added company to database!");
}

function writeCompanyEmployees(query, callback){
  db.ref('employees/' + query.employee).set({
    position: query.position,
    profilePic: query.profilePic,
    jobDescription: query.jobDescription,
    contact: query.contact,
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
  res.render('admin', {
    title: `Admin Panel`
  });
});

app.post('/admin/company', (req, res) => {
  var companyQuery = req.body;

  writeCompanyData(companyQuery, function(err, data){

    if (err) {
      res.redirect('/admin', {
        message: req.flash('error', err)
      });
    }

    // Redirect to admin page
    res.redirect('/admin', {
      message: req.flash('success', data)
    });

  });
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
