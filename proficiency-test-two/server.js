const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');
const multer  = require('multer');
const upload = multer({ dest: os.tmpdir() });
const port = 3000;

const dbServ = require('./services/db.service');

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

app.get('/upload', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="upload/file" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
})

app.post('/upload/file', dbServ.importFileToDB);

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
})