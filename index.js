const createError = require('http-errors');
const express = require('express');
const mongoos = require('mongoose');
const cors = require('cors');
const cookiesParser = require('cookie-parser');
const winston = require('winston');
mongoos.set('useFindAndModify', false);

var routesUser = require('./routes/user_route');

const config = require('config');

var app = express();
winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", ex => {
    throw ex;
});
winston.add(winston.transports.File, { filename: "logfile.log" });
mongoos.set('useCreateIndex', true);

require('dotenv').config();  //environmental variables
// process.env.SUPRESS_NO_CONFIG_WARNING = 'y';
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookiesParser());
app.use("/user", routesUser);

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

app.use(function (req, res, next) {
    next(createError(404));
});

mongoos.connect(config.get("db"), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB SERVER connected");
        winston.info("Winston: Connected to Mongo ....");
    })
    .catch(error => console.log(error.message))

// mongoos.Promise = global.Promise;
app.listen(port, () => {
    console.log('Server is running on port: ' + port)
})