require("dotenv").config();
require("./config/database").connect();
const routesIndex = require('./routes/router');
const express = require("express");

const app = express();

app.use(express.json());
routesIndex(app);  

// Logic goes here

module.exports = app;
