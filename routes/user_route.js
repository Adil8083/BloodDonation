const express = require('express');
const route = express.Router();

const user_controller = require('../controllers/user_controller');


module.exports = user_controller;