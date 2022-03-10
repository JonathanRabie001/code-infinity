const csv = require('csv-parser');
const fs = require('fs');
var os = require("os");

function getDirName() {
    return __dirname + '/../saved-files/output.csv';
}

async function readMyCsv(data) {
    return new Promise(resolve => {
        let readFile = fs.createReadStream(getDirName(), {encoding: 'utf8'});
        let f = false;
        readFile.on('data', function(chunk) {
            f = chunk.toString().includes(data);
            if(f) {
                readFile.close();
            }
        }).on('close', function() {
            resolve(f);
        })
    })
}

function randomDate(){
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
    const names = ['Barry','Diana','Diane','Donna','Michael','Nathan','Neil','Nicholas','Oliver','Owen',
    'Paul','Peter','Sean','Sebastian','Simon','Heather','Irene','Jan','Jane','Jasmine'];

    const surnames= ['Sharp','Short','Simpson','Skinner','Slater','Smith','Morgan','Morrison','Murray','Nash',
    'Newman','Nolan','North','James','Johnston','Jones','Kelly','Allan','Alsop','Anderson'];

    req.body.count = 40000;
    console.time('generateCSV');

    fs.writeFile(getDirName(), 'Id, Name, Surname, Initials, Age, DateOfBirth', function(err) {
        if(err) throw err;
    });

    const ws = fs.createWriteStream(getDirName(), { flags: 'a' });
    const watchFile = fs.watch(getDirName(), {encoding: 'utf-8'}, (ev, filename) => {
        console.log(ev);
    })
    let i = req.body.count;
    let id = 1;
    let ok = true;


    do {
        let m1 = Math.floor(Math.random()*(names.length));
        let m2 = Math.floor(Math.random()*(names.length));
        let date = randomDate();
        
        if(!await readMyCsv(names[m1] + "," + surnames[m2] + "," + names[m1].slice(0,1) + "," + date )) {
            ok = ws.write(os.EOL + id + "," + names[m1] + "," + surnames[m2] + "," + names[m1].slice(0,1) + "," + date );
            i--;
            id++;
        }

    } while (i > 0 && ok);
    
    //  (new Date(Date.now()).getFullYear() - new Date(date).getFullYear()) + 
    // do {
    //     let m1 = Math.floor(Math.random()*(names.length));
    //     let m2 = Math.floor(Math.random()*(names.length));
    //     let date = randomDate();

    //     if(!await readMyCsv(names[m1] + "," + surnames[m2] + "," + names[m1].slice(0,1) + "," + date )) {
    //         ws.write(os.EOL + names[m1] + "," + surnames[m2] + "," + names[m1].slice(0,1) + "," + date );
    //         i++
    //     }

    // } while (i != req.body.count);
    // readFile.close();
    // ws.close();

    res.send('File Saved');
    console.timeEnd('generateCSV');

}