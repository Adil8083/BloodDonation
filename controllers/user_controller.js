const user = require('../models/user_model');

exports.createuser = function (req, res, next) {
    const user_info = req.body;
    user.find(userName=>user_info.UserName)
    
    if(user_info){
        res.send({
            success: true,
            message: user_info
        })
        const o = new user(user_info);
        o.save();
    }
}