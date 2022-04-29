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
        const user = await User.findById(req.user.id).catch(function (err) {
            res.status(404);
            res.json({ err: "Error" });
            return;
        });;
        if (!user) {
            res.status(404);
            res.json({ err: "User not found" });
            return;
        }
        const tasks = await Task.find({ userAssociated: user._id }).catch(function (err) {
            res.status(404);
            res.json({ err: "Error" });
            return;
        });;
        if (!tasks || tasks.length == 0) {
            res.status(404);
            res.json({ err: "No tasks found" });
            return;
        }
        res.json(tasks);
    });
    router.get("/usersByName/:term", authenticateToken, async (req, res) => {
        const users = await User.find({}).catch(function (err) {
            res.status(404);
            res.json({ err: "Error" });
            return;
        });;
        const usersMap = users.map(function (user) {
            user = user.toObject();
            delete user.password;
            delete user.refreshToken;
            delete user.accessToken;
            user.id = user._id;
            delete user._id;
            return user;
        }).filter(function (user) {
            return user.username.toLowerCase().includes(req.params.term.toLowerCase());
        }
        );
        res.json(usersMap);
    });

    router.get("/task/:id", authenticateToken, async (req, res) => {
        const task = await Task.findById(req.params.id).catch(function (err) {
            res.status(404);
            res.json({ err: "Error" });
            return;
        });;

        if (!task) {
            res.status(404);
            res.json({ err: "Task not found" });
            return;
        }
        res.json(task);
    });

    router.get("/user/:id", authenticateToken, async (req, res) => {
        console.log(req.params.id)
        let user = await User.findById(req.params.id).catch(function (err) {
            res.status(404);
            res.json({ err: "Error" });
            return;
        });;
        if(!user){
            res.status(404);
            res.json({ err: "User not found" });
            return;
        }
        user = user.toObject();
        delete user.password;
        delete user.refreshToken;
        delete user.accessToken;
        user.id = user._id;
        delete user._id;
        res.json(user);
    });

    router.post("/saveTask", authenticateToken, async (req, res) => {
        let user = undefined;
        if (req.body.term) {
            user = await User.findOne({ username: req.body.term }).catch(function (err) {
                res.status(404);
                res.json({ err: "Error" });
                return;
            });
            console.log(req.body.term)
            if (!user) {
                res.status(404);
                res.json({ err: "User not found" });
                return;
            }
            Task.updateOne(
                { _id: req.body.task._id },
                { $set: { userAssociated: user._id } }
            )
                .then(function (response) {
                    if (response.matchedCount == 0) {
                        res.status(404);
                        res.json({ err: "Task not found" });
                        return;
                    }
                    else res.json(response);
                })
                .catch(function (err) {
                    res.status(404);
                    res.json({ err: "Error" });
                    return;
                });
        }
        else {
            Task.updateOne(
                { _id: req.body.task._id },
                { $set: { userAssociated: req.body.task.userAssociated } }
            )
                .then(function (response) {
                    if (response.matchedCount == 0) {
                        res.status(404);
                        res.json({ err: "Task not found" });
                        return;
                    }
                })
                .catch(function (err) {
                    res.status(404);
                    res.json({ err: "Error" });
                    return;
                });
        }
        res.json({ msg: "Task Saved Suceffully" });
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

