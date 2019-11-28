const express=require('express');
const route=express();
route.use(express.json());
const user = require('../models/user_model');
const bcrypt=require('bcrypt');
route.post("/createUser", 
(req, res, next) => {
    user.find({UserName:req.body.UserName}, (err,data) =>{
        if (Object.getOwnPropertyNames(data).length === 1) {
            return next();     
        }
        else {
            res.send({
                success: false,
                message: "This Name is already taken,Please Enter other Email"
            });
        }
    })
        
},

(req,res,next) => {
    user.find({email:req.body.email}, (err,data) =>{
        if (Object.getOwnPropertyNames(data).length === 1) {
            return next();     
        }
        else {
            res.send({
                success: false,
                message: "This email is already taken,Please Enter other Email"
            });
        }
    })

},
(req,res,next) => {
    user.find({Phone_Number:req.body.Phone_Number}, (err,data) =>{
        if (Object.getOwnPropertyNames(data).length === 1) {
            return next();     
        }
        else {
            res.send({
                success: false,
                message: "This Phone Number is already taken,Please Enter other Phone Number"
            });
        }
    })

},
(req,res,next) =>{
    if (req.body.UserName == req.body.Password){
        res.send({
            success:false,
            message: "Please password which is different from Name"
        });
    }
    else {
        return next()
    }
},
(req,res,next) => {
    bcrypt.hash(req.body.Password,10,(err,hash)=>{
        if (err){
                res.send({
                    success:false,
                    message:"Please Enter password again.."
            });
            }
            else {
                console.log();
                req.body.Password =hash;
                res.send({
                    success: true,
                    message: req.body
                })
                const o = new user(req.body );
                console.log(o.save());
            }
        });
}

);







module.exports = route;
