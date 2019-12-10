const mongoos = require('mongoose');
const Joi = require('@hapi/joi');
const Schema = mongoos.Schema;

const contactus = new Schema({
    id: Schema.Types.ObjectId,
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
});

const contactSchema = mongoos.model("User_FeedBack", contactus);

function validateContact(form) {
    const schema = Joi.object({
        FirstName: Joi.string()
            .min(3)
            .max(12)
            .required(),
        LastName: Joi.string()
            .min(3)
            .max(12)
            .required(),
        email: Joi.string()
            .email()
            .required(),
        message: Joi.string()
            .required()
    });
    return schema.validate(form);
}

exports.validateC = validateContact;
exports.contactus = contactSchema;