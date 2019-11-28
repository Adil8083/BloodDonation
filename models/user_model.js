const mongoos = require('mongoose');
const Joi = require('joi');
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
    Phone_Number: { type: Number, required: true },
    CNIC: { type: Number, required: true },
    is_Reuqested: Boolean,
    NoOFDonations: Number
});

User.methods.generateToken = function () {
    const token = jwt.sign({ _id: this._id }, config.get("privateKey"));
    return token;
}

module.exports = mongoos.model("User_Infos", User)

exports.User = User;