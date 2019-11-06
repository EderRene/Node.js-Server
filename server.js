const port = 3000;

const express = require('express');
const app=express();

app.listen(port, function () {
    console.log('Chat API is up and running on port ' + port + '.');
  });