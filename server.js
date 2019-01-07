const express = require('express');
const app = express();

require('./app/routes')(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});

module.exports = app;

