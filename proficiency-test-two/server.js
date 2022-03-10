const express = require('express');
const bodyParser = require('body-parser');
const port = 5000;

//Routes
const fileHandlingRoutes = require('./routes/filehandeling.routes');

var app = express();
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// for parsing multipart/form-data
app.use(express.static('public'));

app.use('/files', fileHandlingRoutes);

app.get('/', function(req, res) {
    res.sendFile(__dirname +'/html_pages/index.html');
});

app.listen(5000, () => {
    console.log(`App listening on http://localhost:${port}`);
})