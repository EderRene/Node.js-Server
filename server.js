const port = 3000;

const express = require('express');
const database = require('./database.js');
const app=express();

database.connectToDatabase()
  .then((res)=>{
    console.log(res);
  });

app.listen(port, function () {
    console.log('Chat API is up and running on port ' + port + '.');
});