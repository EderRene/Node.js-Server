'use strict'

const port = 3000;
const webContentDirectory = './webContent';
const express = require('express');
const expressUpload = require('express-fileupload');
const bodyParser = require('body-parser');

var utils = require('./global-functions');
var employeeRouter = require("./routers/employee-router");
var campRouter = require('./routers/camp-router');
var fileRouter = require('./routers/file-Router');
var documentTypeRouter = require('./routers/documentType-router');
var workingHoursRouter = require('./routers/workingHours-router');
var holidayRouter = require('./routers/holiday-router');
const security = require('./security');

const app = express();

app.use(utils.centralErrorHandler);
app.use(bodyParser.json());
app.use(express.static(webContentDirectory));
app.use(expressUpload());

app.post('/api/login', security.login);

//app.use(security.authenticate);
app.use('/api/employees', employeeRouter);
app.use('/api/camps', campRouter);
app.use('/api/documentTypes', documentTypeRouter);
app.use('/api/files', fileRouter);
app.use('/api/workingHours', workingHoursRouter);
app.use('/api/holiday', holidayRouter);

app.listen(port, function () {
  console.log('Time management API is up and running on port ' + port + '.');
});