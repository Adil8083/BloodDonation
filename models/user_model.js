const mongoos = require('mongoose');
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

module.exports = mongoos.model("User_Infos", User)