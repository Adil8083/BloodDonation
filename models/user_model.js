const mongoos = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const Schema = mongoos.Schema;
const User = new Schema({
    id: Schema.Types.ObjectId,
    UserName: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    BloodType: { type: String, required: true },
    Address: { type: String, required: true },
    Phone_Number: { type: Number, required: true, unique: true },
    CNIC: { type: Number, required: true, unique: true },
    is_Reuqested: { type: Boolean, default: false },
    NoOFDonations: { type: Number, default: 0 }
});

User.methods.generateToken = function () {
    const token = jwt.sign({ UserName: this.UserName }, config.get("ACCESS_TOKEN"));
    return token;
}

const userSchema = mongoos.model("User_Registration", User)

function validateUser(user) {
    const schema = Joi.object({
        UserName: Joi.string()
            .min(5)
            .max(20)
            .required(),
        Password: Joi.string().pattern(/^[a-zA-Z0-9]{6,12}$/),
        email: Joi.string().email(),
        BloodType: Joi.string().required(),
        Address: Joi.string().required(),
        Phone_Number: Joi.number().integer().min(0000000000).max(99999999999),
        CNIC: Joi.number().min(0000000000000).max(9999999999999),
        is_Reuqested: Joi.boolean(),
        NoOFDonations: Joi.number(),
    });
    return schema.validate(user);
}

exports.User = userSchema;
exports.validate = validateUser;