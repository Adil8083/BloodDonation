const express = require('express');
const route = express();
const admin = require('../middleware/admin');
const { contactus, validateC } = require('../models/contactUS_model');

route.post("/post", async (req, res, next) => {
    const { error } = validateC(req.body);
    if (error) return res.send(error.details[0].message);

    const newFeedBack = new contactus(req.body);
    await newFeedBack.save();
    res.send("new feedback added");
});

route.get("/allFeedBacks/:user", admin, async (req, res, next) => {
    const alldata = await contactus.find();
    res.send(alldata);
})

route.get("/byDate/:user/:FName", admin, async (req, res, next) => {
    const user = await contactus.findOne({ FirstName: req.params.FName });
    if (!user) return res.send("no user found")

    res.send(user);
})

route.delete("/delFeedBack/:user/:FName", admin, async (req, res, next) => {
    const user = await contactus.findOne({ FirstName: req.params.FName })
    if (!user) return res.send("feedback not found not found")
    await contactus.findByIdAndDelete({ _id: user._id })
        .then(res.send("Deleted Succesfully"))

})

module.exports = route;