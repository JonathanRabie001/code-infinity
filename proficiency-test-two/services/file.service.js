const csv = require('csv-parser');
const fs = require('fs');
const {ReadStream} = require('fs')
var os = require("os");
const {Worker} = require('worker_threads');

const outputFile = __dirname + '/../saved-files/output.csv';
const threads = 1;
function getDirName() {
    return __dirname + '/../saved-files/output.csv';
}

exports.getNamesAndSurnames = function() {
    return {
        names: ['Barry','Diana','Diane','Donna','Michael','Nathan','Neil','Nicholas','Oliver','Owen',
        'Paul','Peter','Sean','Sebastian','Simon','Heather','Irene','Sasha Cohen','Jane','Jasmine'],
        surnames: ['Sharp','Short','Simpson','Skinner','Slater','Smith','Morgan','Morrison','Murray','Nash',
        'Newman','Nolan','North','James','Johnston','Jones','Kelly','Allan','Alsop','Anderson']
    }
}


exports.randomDate = function(){
    function randomValueBetween(min, max) {
      return Math.random() * (max - min) + min;
    }
    let date1 = '01-01-1940'
    let date2 = new Date().toLocaleDateString()
    date1 = new Date(date1).getTime()
    date2 = new Date(date2).getTime()
    if( date1>date2){
        return new Date(randomValueBetween(date2,date1)).toLocaleDateString()   
    } else{
        return new Date(randomValueBetween(date1, date2)).toLocaleDateString()  

    }
}

exports.createCSV = async function(req, res) {
    // req.body.count = 1000*600; //Remove after testing
    const namesPerWorker = parseInt(req.body.count)/threads;
    fs.writeFile(getDirName(), 'Id,Name,Surname,Initials,Age,DateOfBirth', function (err) {
        if (err) throw err;
        for(let j = 0; j < threads; j++) {
            const port = new Worker(require.resolve(__dirname + '/../workers/file-writer-worker.js'), {
                workerData: {namesPerWorker, outputFile, j}
            });

            port.on('message', (msg) => {
                console.log(msg);
            })
        }
    });    

    res.send('Saving File');

}
