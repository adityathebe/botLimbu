"use strict";
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
let app = express();

mongoose.connect('mongodb://admin:admin123@ds133044.mlab.com:33044/botlimbu');
let db = mongoose.connection;
db.on('error', (err) => {
    console.log(err)
}).once('open', () => {
    console.log('Connected to mongoDb')
});

app.set("port", (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Use Static File
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/webhook', require('./routes/webhook'));
app.use('/admin', require('./routes/admin'));


app.listen(app.get("port"), function() {
    console.log("Running on port", app.get("port"));
});