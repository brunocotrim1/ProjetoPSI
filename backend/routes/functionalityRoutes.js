const { response } = require("express");
const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
var crypto = require('crypto');
const User = require("../models/User");
const Task = require("../models/Task");
const { translateAliases } = require("../models/User");


Task.collection.drop();



async function init() {
    // await User.collection.drop();
    // await User.deleteMany({})
    const testUser = await User.findOne({ username: "bruno" }); const tasks = [
        {
            name: "Task 1",
            userAssociated: testUser.id,
            progress: 33,
            priority: "LOW",
        },
        {
            name: "Task 2",
            userAssociated: testUser.id,
            progress: 15,
            priority: "CRITICAL",
        },
        {
            name: "Task 3",
            userAssociated: testUser.id,
            progress: 66,
            priority: "MEDIUM",
        },
    ];
    for (let i = 0; i < tasks.length; i++) {
        const task = new Task(tasks[i]);
        await task.save().catch(function (err) { });
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
        if (!tasks || tasks.length == 0) {
            res.status(404);
            res.json({ err: "No tasks found" });
            return;
        }
        res.json(tasks);
    });
    router.get("/usersByName/:term", authenticateToken, async (req, res) => {
        const users = await User.find({});
        const usersMap = users.map(function (user) {
            user = user.toObject();
            delete user.password;
            delete user.refreshToken;
            delete user.accessToken;
            return user;
        }).filter(function (user) {
            return user.username.toLowerCase().includes(req.params.term.toLowerCase());
        }
        );
        res.json(usersMap);
    });

    router.get("/task/:id", authenticateToken, async (req, res) => {
        console.log(req.params.id)
        console.log("aaaaaaaa")
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            res.status(404);
            res.json({ err: "Task not found" });
            return;
        }
        res.json(task);
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

