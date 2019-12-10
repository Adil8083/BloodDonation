const express = require("express");
const route = express();
const auth = require("../middleware/auth");
const checkAdmin = require("../middleware/validateAdmin");
const Joi = require('@hapi/joi');
const _ = require("lodash");
const { User, validate } = require("../models/user_model");
const bcrypt = require("bcrypt");
require('dotenv').config();
route.use(express.json());

route.post("/login", checkAdmin, async (req, res, next) => {
    const { error } = LogINValidate(req.body)
    if (error) return res.status(404).send(error.details[0].message);

    const userName = req.body.UserName;
    const Password = req.body.Password;
    if (!userName || !Password) return res.send("Enter valid username or password");

    let user = await User.findOne({ UserName: userName });
    if (!user) return res.status(400).send("Invalid username or password");

    let comparePassword = await bcrypt.compare(req.body.Password, user.Password);
    if (!comparePassword) return res.status(400).send("Invalid username or password");


    const token = user.generateToken();
    res
        .header("authToken", token)
        .send(token)
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

    const userFound = await User.findOne({ UserName: req.params.username });
    if (!userFound) return res.send("User not found"); const token = 0

    if (req.body.email != null) {
        const userMail = await User.findOne({ email: req.body.email });
        if (!userMail) {
            await User.findByIdAndUpdate({ _id: userFound._id }, req.body)
            res.send("user updates succesfully")
        } else {
            res.send("This email is associated with another account")
        }
    } else {
        await User.findByIdAndUpdate({ _id: userFound._id }, req.body)
        res.send("user updates succesfully")
    }
})

route.put("/forgotPassword", async (req, res, next) => {
    const { error } = forgotpas(req.body);
    if (error) return res.send(error.details[0].message)
    const user = req.body.UserName;
    const password = req.body.Password;
    const confirmPass = req.body.Confirm;
    if (user) {
        const userFound = await User.findOne({ UserName: user });
        if (!userFound) {
            res.send("User not found");
        } else if (!(password === confirmPass)) {
            res.send("Password and Confirm password did not match")
        } else {
            let comparePassword = await bcrypt.compare(password, userFound.Password);
            if (comparePassword) return res.send("You are using old password");

            const hashPass = await bcrypt.hash(password, 10);
            await User.findOneAndUpdate({ UserName: userFound.UserName }, { $set: { Password: hashPass } })
                .then(res.send("Password updates succesfully"));
        }
    } else {
        res.send("Enter username")
    }
})

route.get("/getUsers", auth, async (req, res, next) => {
    const user = await User.findOne({ UserName: req.body.UserName })
    res.send(user);
})

route.delete("/deleteUser/", auth, async (req, res) => {

    const user = await User.findOne({ UserName: req.body.UserName })

    if (!user) return res.send("user does not exist")

    User.findByIdAndDelete({ _id: user._id })
        .then(res.send("This user has been deleted"))
});


function LogINValidate(req) {
    const schema = Joi.object({
        UserName: Joi.string()
            .min(5)
            .max(20)
            .required(),
        Password: Joi.string()
            .min(6)
            .max(12),
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
        is_admin: Joi.boolean(),
        NoOFDonations: Joi.number(),
    })
    return schema.validate(req);
}
function forgotpas(req) {
    const schema = Joi.object({
        UserName: Joi.string()
            .min(5)
            .max(20)
            .required(),
        Password: Joi.string()
            .min(6)
            .max(12),
        Confirm: Joi.string()
            .min(6)
            .max(12)
    })
    return schema.validate(req);
}
module.exports = route;
