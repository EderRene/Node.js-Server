'use strict'

const port = 3000;
const webContentDirectory = './webContent';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectionsStringMongo = 'nothing_yet';

//connectMongo();

var utils = require('./global-functions');
var employeeRouter=require("./routers/employee-router");
const app=express();

app.use(utils.centralErrorHandler);
app.use(bodyParser.json());
app.use(express.static(webContentDirectory));
app.use('/api/employees', employeeRouter);

app.listen(port, function () {
    console.log('Time management API is up and running on port ' + port + '.');
});

function connectMongo() {
  mongoose.connect(connectionsStringMongo, { useNewUrlParser: true, useCreateIndex: true },
    function(err){
      if(err){
        console.warn('could not Connect to DB '+ err);
      }else{
        console.log('database connection to mongodb successfully established');
      }
    }
  );
} 