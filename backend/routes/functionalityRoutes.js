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
        const tasks = await Task.find({ usersAssigned: user._id }).catch(function (err) {
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

    router.get("/allTasks", authenticateToken, async (req, res) => {
        const tasks = await Task.find({}).then(
            function (tasks) {
                res.json(tasks);
            }
        ).catch(function (err) {
        });;


    });

    router.get("/getusers", authenticateToken, async (req, res) => {
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
        })
        res.json(usersMap);
    });

    router.get("/task/:id", authenticateToken, async (req, res) => {
        await Task.findById(req.params.id)
            .then(async function (response) {
                response = response.toObject();
                for (let f = 0; f < response.usersAssigned.length; f++) {
                    response.usersAssigned[f] = await User.findById(response.usersAssigned[f])
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
                console.log(response);
                res.json(response);
            })
            .catch(function (err) {
                res.status(404);
                res.json({ err: "Not Found" });
            });;
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
                for (let i = 0; i < response.members.length; i++) {
                    response.members[i] = await User.findById(response.members[i])
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
            .then(async function (response) {
                for (let i = 0; i < response.length; i++) {
                    response[i] = response[i].toObject();
                    for (let f = 0; f < response[i].members.length; f++) {
                        response[i].members[f] = await User.findById(response[i].members[f])
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
                }
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
        if (!user) {
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
        Task.updateOne(
            { _id: req.body._id },
            { $set: { usersAssigned: req.body.usersAssigned,beginDate: new Date(req.body.beginDate),endDate:new Date(req.body.endDate) } }
        )
            .then(function (response) {
                if (response.matchedCount == 0) {
                    res.status(404);
                    res.json({ err: "Task not found" });
                    return;
                }else
                res.json({ msg: "Task Saved Suceffully" });
            })
            .catch(function (err) {
                res.status(404);
                res.json({ err: "Error" });
                return;
            });

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
                { name: req.body.name, members: req.body.members }
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

    router.post("/addproject", authenticateToken, async (req, res) => {
        console.log(req.body);
        await Project.create({ name: req.body.username, acronym: req.body.acronym, beginDate: new Date(req.body.beginDate), endDate: new Date(req.body.endDate) })
            .then(function (response) {
                res.json({ msg: "Projeto criado com sucesso" });
                return;
            })
            .catch(function (err) {
                console.log(err);
                res.status(404);
                res.json({ err: "Projeto ja existe" })
                return;
            })
    });

    router.put("/updateteam/:id", authenticateToken, async (req, res) => {
        console.log(req.params.id)
        console.log(req.body.members)
        if (req.body.members.length == 0) {
          await Team.updateOne({ _id: req.params.id }, { $unset: {members: []}})
          .then(function (response) {
            if (response.matchedCount == 0){
              console.log("Dont exist")
              res.status(404)
              res.json({msg: "Team doesn't exist on DB."})
            } else {
              console.log("All good")
              console.log(response)
              res.json({msg: "Team cleared on DB updated."})
            }
          }).catch(function(exception){
            console.log("VERY BAD cleaning")
            res.status(500)
            res.json({msg: "Couldnt update team", error: exception.message})
          });
        } else {
          ids = [];
          for(let i = 0; i < req.body.members.length; i++) {
            if(req.body.members[i].id) {
                ids.push(req.body.members[i].id);
            }
            else {
              ids.push(req.body.members[i]._id)
            }
          }
          console.log(ids);
          console.log(req.body.members);
          await Team.updateOne({ _id: req.params.id }, { $set: {members: ids}})
          .then(function (response) {
            if (response.matchedCount == 0){
              console.log("Dont exist")
              res.status(404)
              res.json({msg: "Team doesn't exist on DB."})
            } else {
              console.log("All good")
              console.log(response)
              res.json({msg: "Team info on DB updated."})
            }
          }).catch(function(exception){
            console.log(exception);
            console.log("VERY BAD putting")
            res.status(500)
            res.json({msg: "Couldnt update team", error: exception.message})
          });
        }
      });

      router.put("/updatetasktoproject", authenticateToken, async (req, res) => {
        console.log(req.body.task)
        console.log(req.body.project)
        res.json({msg: "eqwopmosfdipsa."})
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

