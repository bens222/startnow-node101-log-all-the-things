const express = require('express');
const fs = require('fs');
const app = express();

//Creates an array to push request data into
var csvArr = [];
//Creates an Array to hold all my JSON converted logs
var jsonArr = [];
// Logging Code
app.use((req, res, next) => {
    // Calls the agent that is making the request
    var agent = req.get('User-agent'); 
    csvArr.push(agent);
    
    // Creates a new date for when the request was made using ISO date standard
    var getDate = new Date();
    var isoDate = getDate.toISOString();
    csvArr.push(isoDate);
    
    // Calls the method of the request
    var method = req.method;
    csvArr.push(method);
    
    // Calls the the path and file requested
    var resource = req.url;
    csvArr.push(resource);
    
    // Calls the http version of the request
    var version = 'HTTP/' + req.httpVersion;
    csvArr.push(version);
    
    // Calls the status of the request
    var status = res.statusCode;
    csvArr.push(status.toString());
    
    
    var stringifyArr = csvArr.join(",") // Puts array into string form with each index separated by commas
    var newLine = `\n${stringifyArr}` // Puts each log request on new line
    
    // Logs every server request to console
    console.log(newLine)
    
    // Logs each request is .csv file
    fs.appendFile('./log.csv', newLine, () => {
        console.log('The request log was appended to file!')
    });

    // Creates an Object to store logs
    jsonObj = {
        Agent: agent,
        Time: isoDate,
        Method: method,
        Resource: resource,
        Version: version,
        Status: status
    }

    // Converts Object to JSON format
    json = JSON.stringify(jsonObj)
    
    // Pushes all my JSON formatted logs into an Array, so that they can be sent on /logs route
    jsonArr.push(jsonObj)
    
    // Clears array, so that next request won't combine with previous requests
    csvArr = [];

    next();
});

app.get('/', (req, res) => {
    // Writes code to respond "ok" on home route
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, {'Content-type': 'text/plain'});
    res.end('ok');
});

app.get('/logs', (req, res) => {
    // Sends all logs in csv to client as JSON file type
    res.send(jsonArr);
});

module.exports = app;
