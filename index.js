const express = require('express');
const mongoos = require('mongoose');
const cors = require('cors');
const routesUser = require('./routes/user_route');

mongoos.set('useCreateIndex', true);

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use("/user", routesUser);

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
        res.status(200).json({});
    }
    next();
});
const uri = process.env.ATLAS_URI;
const mongoURL = "mongodb://localhost:" + uri;
mongoos.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoos.Promise = global.Promise;
const connection = mongoos.connection;
connection.once('open', () => {
    console.log("MongoDB SERVER connected")
})
app.listen(port, () => {
    console.log('Server is running on port: ' + port)
})