const express = require('express');
const route = express.Router();

const user_controller = require('../controllers/user_controller');

route.post("/createUser", user_controller.createuser)

module.exports = route;