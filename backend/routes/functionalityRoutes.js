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
const { Console } = require("console");






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

    router.get("/tasks/fromuser/:id", authenticateToken, async (req, res) => {
        console.log(req.params.id)
        const user = await User.findById(req.params.id).catch(function (err) {
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
                if (response.linkedProject) {
                    response.linkedProject = await Project.findById(response.linkedProject)
                        .then(function (proj) {
                            return proj;
                        }).catch(function (err) {
                            res.status(404);
                            throw err;
                        });
                }
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
        if (!req.body._id) {

            res.status(404);
            console.log("No id")
            res.json({ err: "No id" });
            return;
        }
        if (req.body.linkedProject && !req.body.linkedProject._id) {
            req.body.linkedProject._id = null;
        }

        if (req.body.beginDate && req.body.endDate) {
            const dateInicio = new Date(req.body.beginDate);
            const dateFin = new Date(req.body.endDate);

            if (dateInicio.getTime() >= dateFin.getTime()) {
                res.status(404);
                console.log("Data inicio tem de ser anterior a data de fim")
                res.json({ err: "Data inicio tem de ser anterior a data de fim" });
                return;
            }
            if (req.body.priority == "CRITICAL") {
                const tasks = await Task.find({})
                    .then(function (response) {
                        return response;
                    })
                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].beginDate && tasks[i].endDate && tasks[i].progress != 100 && tasks[i].priority == "CRITICAL" && tasks[i].usersAssigned.includes(req.user.id) && tasks[i]._id != req.body._id) {
                        const dateInicioCompare = new Date(tasks[i].beginDate);
                        const dateFinCompare = new Date(tasks[i].endDate);
                        //(StartDate1 <= EndDate2) and (StartDate2 <= EndDate1)

                        if (dateInicioCompare.getTime() <= dateFin.getTime() && dateFinCompare.getTime() >= dateInicio.getTime()) {
                            console.log("Intercecao")
                            res.status(404);
                            res.json({ err: "Existe outra tarefa de prioridade urgente a qual esta se sobrepõe" });
                            return;
                        }
                    }
                }
            }
        }
        if (!req.body.linkedProject) {
            req.body.linkedProject = { _id: undefined };
        }
        if (req.body.beginDate && req.body.endDate) {
            Task.updateOne(
                { _id: req.body._id },
                { $set: { usersAssigned: req.body.usersAssigned, beginDate: new Date(req.body.beginDate), endDate: new Date(req.body.endDate), linkedProject: req.body.linkedProject._id ,progress:req.body.progress} }
            ).then(function (response) {
                if (response.matchedCount == 0) {
                    res.status(404);
                    res.json({ err: "Task not found" });
                    return;
                } else
                    res.json({ msg: "Task Saved Suceffully" });
            })
                .catch(function (err) {
                    res.status(404);
                    res.json({ err: "Error" });
                    return;
                });
        } else if (!req.body.beginDate && !req.body.endDate) {
            Task.updateOne(
                { _id: req.body._id },
                { $set: { usersAssigned: req.body.usersAssigned, linkedProject: req.body.linkedProject._id } }
            ).then(function (response) {
                if (response.matchedCount == 0) {
                    res.status(404);
                    res.json({ err: "Task not found" });
                    return;
                } else
                    res.json({ msg: "Task Saved Suceffully" });
            })
                .catch(function (err) {
                    res.status(404);
                    res.json({ err: "Error" });
                    return;
                });
        } else {
            res.status(404);
            res.json({ err: "Tem de existir duas datas" });
            return;
        }
    });
    router.post("/createtask/add", authenticateToken, async (req, res) => {
        await Task.create({ name: req.body.taskname, priority: req.body.priority, percentage: req.body.percentage, progress: 0, usersAssigned: req.body.userID.id })
            .then(function (response) {
                console.log(response)
                res.json({ msg: "Task Saved Suceffully" });
                return
            })
            .catch(function (err) {
                res.status(404);
                console.log(err);
                res.json({ err: "Internal error." })
                return;
            });
    });


    router.post("/teams/add", authenticateToken, async (req, res) => {
        await Team.create({ name: req.body.team.name, members: req.body.team.members })
            .then(function (response) {
                console.log(response)
                res.json({ msg: "Team Saved Suceffully" });
                return
            })
            .catch(function (err) {

                console.log(err);
                res.json({ err: "Internal error." })
                return;
            });
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

    router.put("/updateteam", authenticateToken, async (req, res) => {
        console.log(req.body)
        await Team.updateOne({ _id: req.body._id }, { $set: { members: req.body.members } }).then(
            function (response) {
                res.json({ msg: "Team updated Suceffully" });
                return;
            }
        ).catch(function (err) {

            res.status(404);
            res.json({ err: "Team not found" })
            return;
        })
    });

    router.put("/updatetasktoproject", authenticateToken, async (req, res) => {
        console.log(req.body.task)
        console.log(req.body.project)
        res.json({ msg: "eqwopmosfdipsa." })
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

