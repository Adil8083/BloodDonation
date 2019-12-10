const { User } = require('../models/user_model');

module.exports = async function (req, res, next) {
    const user = await User.findOne({ UserName: req.params.user });
    if (user.is_admin == false) return res.status(403).send("Access denied.");

    next();
};
