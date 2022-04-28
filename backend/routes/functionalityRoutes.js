const { response } = require("express");
const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
var crypto = require('crypto');
const User = require("../models/User");
const Task = require("../models/Task");
const tasks = [
    {
        name: "Task 1",
        userAssociated: "6266e43978bcd86e4b6eacfe",
        progress: 0,
        priority: "LOW",
    },
    {
        name: "Task 2",
        userAssociated: "6266e43978bcd86e4b6eacfe",
        progress: 0,
        priority: "LOW",
    },
    {
        name: "Task 3",
        userAssociated: "6266e43978bcd86e4b6eacfe",
        progress: 0,
        priority: "LOW",
    },
];


async function init() {
    // await User.collection.drop();
    // await User.deleteMany({})
  
    for (let i = 0; i < tasks.length; i++) {
        const task = new Task(tasks[i]);
        await task.save().catch(function (err) {});
    }
    //   await User.create({
    //     username: "bruno",
    //     password: SHA_256("bruno"), 
    //     role: "admin",
    //   })
  }
  
  init()

module.exports = function (dbI) {
    router.get("/tasks", authenticateToken, async (req, res) => {
        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(404);
            res.json({ err: "User not found" });
            return;
        }
        const tasks = await Task.find({ userAssociated: user._id });
        if(!tasks || tasks.length == 0){
            res.status(404);
            res.json({ err: "No tasks found" });
            return;
        }
        res.json(tasks);
      });
    return router;
};


function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.accessToken_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        req.user.refreshToken = token;
        next();
    });
}

