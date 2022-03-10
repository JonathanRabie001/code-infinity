var csv = require("fast-csv");
const fs = require('fs');
const {workerData, parentPort} = require('worker_threads');
const {namesPerWorker, outputFile, j} = workerData;
const {getNamesAndSurnames, randomDate} = require('../services/file.service');
const os = require('os');

var readline = require('readline');


function genrateIntials(name) {
    name = name.split(' ');
    let intial = '';
    let i = 0;
    do {
        intial += name[i].slice(0,1);
        i++;    
    } while (i != name.length);
    return intial;
}

function insertInto(element, array) {
    array.splice(locationOf(element, array) + 1, 0, element);
    return array;
}
  
function locationOf(element, array, start, end) {
    start = start || 0;
    end = end || array.length;
    var pivot = parseInt(start + (end - start) / 2, 10);
    if (end-start <= 1 || array[pivot] === element) return pivot;
    if (array[pivot] < element) {
        return locationOf(element, array, pivot, end);
    } else {
        return locationOf(element, array, start, pivot);
    }
}

async function binarySearch(arr, s, l , h) {
    return new Promise(resolve => {
        if(h >= l) {
            let mid = l + (h-l)/2;

            if(arr[mid] == s) {
                resolve(mid);
            }

            if(arr[mid] > s) {
                resolve (binarySearch(arr,s, l, mid - 1));
            }

            resolve (binarySearch(arr, s, mid+1 , h));
        }

        resolve (-1);
    })
}
  
async function readMyCsv(data) {
    return new Promise(resolve => {
        let readFile = fs.createReadStream(outputFile, {encoding: 'utf8'});
        const rl = readline.createInterface({
        input: readFile,
        output: process.stdout});
        let f = false;


        rl.on('line', (line) => {
            if(line.slice(0, line.indexOf(',')) != 'Id') {
                const ln = line.slice(line.indexOf(',')+1, line.length);
                if(data.includes(ln)) {
                    f = true;
                }
            }
        })

        rl.on('close', () => {
            resolve(f);
            rl.close();
            readFile.close();
            readFile.destroy();
        });
    })
}
  
(async () => {
    console.time('generateCSV');
    let i = namesPerWorker;
    let idStart = (i*j)+1;
    // const readFile = fs.createReadStream(dir, {encoding: 'utf-8', autoClose: false, highWaterMark: 976.5625 * 1024});
    const ws = fs.createWriteStream(outputFile, { flags: 'a' });
    let insert;
    
    while (i > 0) {
        let m1 = Math.floor(Math.random()*(getNamesAndSurnames().names.length));
        let m2 = Math.floor(Math.random()*(getNamesAndSurnames().surnames.length));
        let DOB = randomDate();
        let age = Math.floor((Date.now() - new Date(DOB).getTime())/31556952000);// Convert Miliseconds to Years
        insert =
        getNamesAndSurnames().names[m1] + 
        ',' + getNamesAndSurnames().surnames[m2] +
        ',' + genrateIntials(getNamesAndSurnames().names[m1]) +
        ',' + age + ',' + DOB.split('/').reverse().join('/');

        if(!await readMyCsv(insert)) {
            ws.write(os.EOL + (idStart++) + ',' + insert);
            i--;
        }
    }

    console.time('generateCSV');


})();