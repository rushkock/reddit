const fs = require('fs');

const inputFile = "./subreddits_norm_toxic.csv";

//-------------- read file
const fileLines = fs
    .readFileSync(inputFile, 'utf8')
    .split(/\r?\n/)
    .filter(line => line.length > 0);
fileLines.shift();


//  -------------------
const staticRoot = {name: "root", children: []};
const output = staticRoot.children;

fileLines.forEach(line => {
    const lineParts = line.split(',');
    const parent = lineParts[3];   //column D
    const child = lineParts[4];
    const target = lineParts[5];

    let rootLevel = output.find(i => i.name == parent);
    if (!rootLevel) {
        rootLevel = {
            name: parent,
            children: []
        };
        output.push(rootLevel);
    }


    let childLevel = rootLevel.children.find(i => i.name == child);
    if (!childLevel) {
        childLevel = {
            name: child,
            children: []
        }
        rootLevel.children.push(childLevel);
    }


    let targetLevel = childLevel.children.find(i => i.name == target);
    if (!targetLevel) {
        targetLevel = {
            name: target,
            children: []
        };
        childLevel.children.push(targetLevel);
    }
});

// output.json is built here
const path = '../app/static/json/';

fs.readdir(path, (err ,files) => {
    if (files.indexOf('data.json') > 0) {
        var now = new Date();
        var backupFileName = 'data.as.' + now.getFullYear() + '.' + (now.getMonth() + 1).toString() + '.' + now.getDate() + '.json';
        fs.rename(path + 'data.json',  path + backupFileName, function(err) {
            if ( err ) console.log('ERROR: ' + err);
            else fs.writeFileSync('../app/static/json/data.json', JSON.stringify(staticRoot)); 
        });
    } else {
        fs.writeFileSync('../app/static/json/data.json', JSON.stringify(staticRoot)); 
    }
});

// fs.writeFileSync('../app/static/json/data.json', JSON.stringify(staticRoot));