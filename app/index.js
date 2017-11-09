require('dotenv').config()
const path = require('path');

const express = require('express');
const app = express();

const host = process.env.APP_HOST || '127.0.0.1';
const port = process.env.APP_PORT || 8080;

const admin = require('./firebase-admin');


app.use((req, res, next) => {
    next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + "/views/index.html"));
});


app.listen(port, host);
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

console.log(`Server starting on http://${host}:${port}`)
