const express = require("express");
const app = express();
var cors = require('cors')

//Import the mongoose module
var mongoose = require("mongoose");

//Set up default mongoose connection
var mongoDB = "mongodb://127.0.0.1:27017/heros_database";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
const heroesRouter = require("./routes/routes")(db);
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use("/api", heroesRouter);
const authRouter = require("./routes/authenticationRoutes")(db);
app.use("/api/authentication", authRouter);
app.listen(8080);

