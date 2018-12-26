const express = require('express');
const app = express();

require('./app/routes')(app);
app.listen('8080');
console.log('API is running on http://localhost:8080');
module.exports = app;

