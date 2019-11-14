'use strict'

const port = 3000;
const webContentDirectory = './webContent';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectionsStringMongo = 'nothing_yet';
const database = require('./database.js');

var utils = require('./global-functions');
var employeeRouter=require("./routers/employee-router");
var campRouter=require('./routers/camp-router')
const app=express();

app.use(utils.centralErrorHandler);
app.use(bodyParser.json());
app.use(express.static(webContentDirectory));
app.use('/api/employees', employeeRouter);
app.use('/api/camps', campRouter);

database.connectToDatabase()
  .then((res)=>{
    console.log(res);
  })
  .catch((err)=>{
    console.log(err);
  });

//connectMongo();

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