"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
let app = express();

mongoose.connect('mongodb://admin:admin123@ds153003.mlab.com:53003/messenger');
let db = mongoose.connection;
db.on('error', (err) => {
    console.log(err)
}).once('open', () => {
    console.log('Connected to mongoDb')
});

app.set("port", (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routes
app.use('/', require('./routes/index'));
app.use('/webhook', require('./routes/webhook'));

app.listen(app.get("port"), function() {
    console.log("Running on port", app.get("port"));
});