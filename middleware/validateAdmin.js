const { User } = require('../models/user_model');
module.exports = async function (req, res, next) {
    const user = await User.findOne({ UserName: req.body.UserName });
    if (req.body.UserName === 'admin') {
        const a = {
            is_admin: true
        }
        await User.findOneAndUpdate({ UserName: req.body.UserName }, a);
        next();
    } else {
        next();
    }
}