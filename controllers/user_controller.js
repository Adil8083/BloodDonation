const express = require("express");
const route = express();
route.use(express.json());
const auth = require("../middleware/auth");
const Joi = require('@hapi/joi');
const _ = require("lodash");
const { User, validate } = require("../models/user_model");
const bcrypt = require("bcrypt");
require('dotenv').config();
route.use(express.json());

route.post("/login", async (req, res, next) => {
    const { error } = LogINValidate(req.body)
    if (error) return res.status(404).send(error.details[0].message);

    const userName = req.body.UserName;
    const Password = req.body.Password;
    if (!userName || !Password) {
        res.send("Enter valid username or password");
    }
    let user = await User.findOne({ UserName: userName });
    if (!user) return res.status(400).send("Invalid username or password");
    let comparePassword = await bcrypt.compare(req.body.Password, user.Password);
    if (!comparePassword) res.status(400).send("Invalid username or password")

    const token = user.generateToken();
    res
        .header("authToken", token)
        .send("Token:" + token + "\n" + user.UserName)
})

route.post("/createUser", async (req, res, next) => {
    const { error } = validate(req.body)

    if (error) return res.status(404).send(error.details[0].message);

    const username = await User.findOne({ UserName: req.body.UserName });
    const em = await User.findOne({ email: req.body.email });
    const cnic = await User.findOne({ cni: req.body.CNIC });
    const ph = await User.findOne({ PhoneNUmber: req.body.Phone_Number });

    if (username) return res.status(400).send("User already register")
    else if (em) return res.status(400).send("Email already registered")
    else if (cnic) return res.status(400).send("CNIC already registered")
    else if (ph) return res.status(400).send("PhoneNumber already registered")

    const users = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    users.Password = await bcrypt.hash(users.Password, salt);
    await users.save();
    res.send(_.pick(users, ["_id", "UserName", "email"]))

})

route.put("/updateUser/:username", async (req, res, next) => {
    const { error } = updateValidate(req.body);
    if (error) return res.status(401).send(error.details[0].message);

    const uu = await User.findOne({ UserName: req.params.username })
    if (uu) {
        if (req.body.email) {
            const e = await User.findOne({ email: req.body.email });
            if (e) {
                res.send("This email is associated with another account")
            } else {
                await User.findByIdAndUpdate({ _id: uu._id }, req.body)
                    .then(res.send("updated succesfully"))
            }
        } else {
            await User.findByIdAndUpdate({ _id: uu._id }, req.body)
                .then(res.send("updated succesfully"))
        }
    } else {
        res.send("user not found")
    }

})

route.get("/getUsers", auth, async (req, res, next) => {
    const user = await User.findOne({ UserName: req.body.UserName })

    res.send(user);
})

route.delete("/deleteUser/:UserName", async (req, res) => {
    await User.findOne({ UserName: req.params.UserName }).then(function (user) {
        if (!user) {
            res.send("This username doesnot exist.");
        } else {
            User.findByIdAndDelete({ _id: user._id }).then(function (user) {
                res.send("This User has been deleted.");
            });
        }
    });
});


function LogINValidate(req) {
    const schema = Joi.object({
        UserName: Joi.string()
            .min(5)
            .max(20)
            .required(),
        Password: Joi.string()
            .min(6)
            .max(12)
    });
    return schema.validate(req);
}
function updateValidate(req) {
    const schema = Joi.object({
        email: Joi.string().email(),
        BloodType: Joi.string(),
        Address: Joi.string(),
        Phone_Number: Joi.number().integer().min(0000000000).max(99999999999),
        CNIC: Joi.number().min(0000000000000).max(9999999999999),
        is_Reuqested: Joi.boolean(),
        NoOFDonations: Joi.number(),
    })
    return schema.validate(req);
}
module.exports = route;
