const { response } = require("express");
const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
var crypto = require('crypto');
const User = require("../models/User");
const Task = require("../models/Task");
const Project = require("../models/Project");
const Team = require("../models/Team");
const { translateAliases } = require("../models/User");

Team.collection.drop();
Task.collection.drop();
Project.collection.drop();

async function init() {
    // await User.collection.drop();
    // await User.deleteMany({})
    const testUser = await User.findOne({ username: "bruno" }); 

    const tasks = [
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

    const testUser2 = await User.findOne({ username: "miguel" }); 

    const testTeams = [
        {
            name: "Team 1",
            users: [testUser.id,testUser2.id]
        },
        {
            name: "Team 2",
            users: [testUser2.id]
        },
        {
            name: "Team 3",
            users: [testUser2.id]
        }
    ];
    for (let i = 0; i < testTeams.length; i++) {
        const team = new Team(testTeams[i]);
        await team.save().catch(function (err) { });
    }

    const checkteams = await Team.find({});

    const testProject = [
        {
            name: "Project 1",
            acronym: "PT1",
            linkedTeam: checkteams[0].id,
        },
        {
            name: "Project 2",
            acronym: "PT2",
            linkedTeam: checkteams[1].id,
        },
        {
            name: "Project 3",
            acronym: "PT3",
        },
    ];
    for (let i = 0; i < testProject.length; i++) {
        const proj = new Project(testProject[i]);
        await proj.save().catch(function (err) { });
    }
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

    
    router.get("/getprojects", authenticateToken, async (req, res) => {
        await Project.find({})
        .then(function (response) {
            console.log(response);
          res.json(response);
        })
        .catch(function (err) {
          res.status(404);
          res.json({ err: "Not Found" });
        });;
    });

    router.get("/getteam/:id", authenticateToken, async (req, res) => {
        await Team.findById(req.params.id)
        .then(async function (response) {
            response = response.toObject();
            for(let i = 0; i < response.users.length; i++){
                response.users[i] = await User.findById(response.users[i])
                .then(function (usr) {
                    usr = usr.toObject();
                    delete usr.password;
                    delete usr.refreshToken;
                    delete usr.accessToken;
                    return usr;
                }).catch(function (err) {
                    res.status(404);
                    throw err;
                });
            }
            res.json(response);
            return;
        })
        .catch(function (err) {
            console.log(err)
          res.status(404);
          res.json({ err: "Not Found" });
          return;
        });
    });

    router.get("/getteams", authenticateToken, async (req, res) => {
        await Team.find({})
        .then(function (response) {
          res.json(response);
        })
        .catch(function (err) {
          res.status(404);
          res.json({ err: "Not Found" });
        });;
    });

    router.get("/getusers", authenticateToken, async (req, res) => {
        await User.find({})
        .then(function (response) {
          res.json(response);
        })
        .catch(function (err) {
          res.status(404);
          res.json({ err: "Not Found" });
        });;
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

    router.get("/api/getteamusers/:teamname", authenticateToken, async ({body: { title, body }}, res) => {

        const team = async() => {
            Team.findOne({name: req.params.teamname}).then(
                function (response) {
                    let users = team.users;
                    let userList = [];
                    for (let i = 0; i < users.length; i++) {

                        let user = new User;
                        user.id = users[i]._id,
                        user.username = users[i].name
                        
                        userList.push(user)


                    }
                        
                    res.json(userList)
                    
                    return
                }).catch(function (err) {
                    res.status(404);
                    res.json({ err: "Error" });
                    return;
                });
            }
        team().then(function(v) {
            res.send(v)
        })
        
    });
    
    router.post("/teams/add", authenticateToken, async (req, res) => {
        console.log("TRYING TO CREATE")
        console.log(req.body.name)
        console.log(req.body.members)
        const teamExists = await Team.exists({ name: req.body.name })
        .catch(function (err) {
        res.status(404);
        res.json({ err: "Internal error." })
        return;
        });
        if (!teamExists) {
        await Team.create(
            {name: req.body.name, members: req.body.members }
        )
            .then(function (response) {
            console.log(response)
            res.json(response);
            return;
            })
            .catch(function (err) {
            res.status(404);
            res.json({ err: "Internal error." })
            return;
            });
        } else {
        res.status(404);
        res.json({ err: "User with the selected name already exists." })
        }    
        res.json({ msg: "Team Saved Suceffully" });
    });

    return router;
};


function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    console.log(req.path)
    if (req.path == "/refresh_token") {
      jwt.verify(token, process.env.accessToken_SECRET, { ignoreExpiration: true }, async (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.user = decoded;
        req.user.refreshToken = token;
      }
      );
      return next();
    }
  
  
    jwt.verify(token, process.env.accessToken_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      req.user.refreshToken = token;
      next();
    });
  }

