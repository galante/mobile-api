// set variables for environment
var Converter = require("csvtojson").Converter;
var express = require('express');
var app = express();
var path = require('path');
var fs = require("fs");

// global variable for our catalog
var data = null;

var csvFileName="./catalog.csv";

var csvConverter = new Converter({
       workerNum: 4,
       noheader: false,
       checkType: true
});

csvConverter.on("end_parsed", function(jsonObj) {
  data = jsonObj;
});

fs.createReadStream(csvFileName).pipe(csvConverter);

app.set('port', (process.env.PORT || 8090));

app.get('/products', function (req, res) {
  console.log("Returning data:");
  res.status(200).json(data);
  res.end();
});

app.get('/reload', function (req, res) {
  console.log("reloaded file");
  csvConverter.on("end_parsed", function(jsonObj) {
    data = jsonObj;
  });

  fs.createReadStream(csvFileName).pipe(csvConverter);
  res.status(200).json("reloaded " + csvFileName);
  res.end();
});


app.listen(app.get('port'), function() {
       console.log('Node app is running on port', app.get('port'));
});
