const express = require('express');
const route = express();
const _ = require('lodash');
const user = require('../models/user_model');
const bcrypt = require('bcrypt');
route.use(express.json());

route.post("/createUser", async (req, res, next) => {
    user.find({ UserName: req.body.UserName }, (err, data) => {
        if (Object.getOwnPropertyNames(data).length === 1) {
            return next();
        } else {
            res.send({
                success: false,
                message: "This Name is already taken,Please Enter other Name"
            });
        }
    })
}, async (req, res, next) => {
    user.find({ email: req.body.email }, (err, data) => {
        if (Object.getOwnPropertyNames(data).length === 1) {
            return next();
        } else {
            res.send({
                success: false,
                message: "This email is already taken,Please Enter other Email"
            });
        }
    })
}, async (req, res, next) => {
    user.find({ Phone_Number: req.body.Phone_Number }, (err, data) => {
        if (Object.getOwnPropertyNames(data).length === 1) {
            return next();
        } else {
            res.send({
                success: false,
                message: "This Phone Number is already taken,Please Enter other Phone Number"
            });
        }
    })
}, async (req, res, next) => {
    if (req.body.UserName == req.body.Password) {
        res.send({
            success: false,
            message: "Please enter password which is different from Name"
        });
    } else {
        return next()
    }
}, async (req, res, next) => {
    console.log();
    const users = new user(req.body);
    const salt = await bcrypt.genSalt(10);
    users.Password = await bcrypt.hash(users.Password, salt);
    await users.save();
    const token = users.generateToken();
    res
        .header("authToken", token)
        .send(_.pick(users, ["_id", "UserName", "email"]))
}
);

module.exports = route;
