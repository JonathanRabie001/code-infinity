const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const  csv = require('csv-parser');
const res = require('express/lib/response');
var formidable = require('formidable');

let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
  db.run(`DROP TABLE IF EXISTS csv_import`);
  db.run(`CREATE TABLE csv_import(
    id number,
    name string,
    surname string,
    initials string,
    age string,
    dateOfbirth string
  )`);

  exports.importFileToDB = function(req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      const read = fs.createReadStream(files.filetoupload.filepath);

      db.run('DELETE  FROM csv_import'); //Clears Current data in table
  
      read.pipe(csv({separator: ','})).on('data', function (row)  {
        db.run(`INSERT INTO csv_import VALUES(${row.Id}, '${row.Name}','${row.Surname}','${row.Initials}','${row.Age}','${row.DateOfBirth}')`, (err) => {
          if(err) throw err;
        });
      }).on('close', () => {
        res.send('Data Imported');
      });
    });






  }