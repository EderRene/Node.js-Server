const port = 8888;

const express = require('express');
const database = require('./database.js');
const app=express();

console.log('test');

app.use(express.static(webContentDirectory));

database.connectToDatabase()
  .then((res)=>{
    console.log(res);
  });

app.listen(port, function () {
    console.log('API is up and running on port ' + port + '.');
});