const { response } = require("express");
const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
var crypto = require('crypto');
const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Team = require("../models/Team");
const Reunion = require("../models/Reunion");
const Unavailability = require("../models/Unavailability");


const users = [
  {
    username: "bruno",
    password: SHA_256("bruno"),
    role: "ADMIN",
  },
  {
    username: "miguel",
    password: SHA_256("miguel"),
    role: "ADMIN",
  },
  {
    username: "joao",
    password: SHA_256("joao"),
    role: "ADMIN",
  },
  {
    username: "diogo",
    password: SHA_256("diogo"),
    role: "ADMIN",
  },
  {
    username: "miguelS",
    password: SHA_256("miguelS"),
    role: "ADMIN",
  },
  {
    username: "professor",
    password: SHA_256("123Professor321"),
    role: "ADMIN",
  },
  {
    username: "aluno",
    password: SHA_256("123Aluno321"),
    role: "USER",
  },
];


async function init() {

  //User.deleteMany({}).catch(function (err) { });

  for (let i = 0; i < users.length; i++) {
    const user = new User(users[i]);
    await user.save().catch(function (err) { });
  }

  const bruno = await User.findOne({ username: "bruno" });
  const miguel = await User.findOne({ username: "miguel" });
  const lucas = await User.findOne({ username: "joao" });
  const miguelS = await User.findOne({ username: "miguelS" });
  const diogo = await User.findOne({ username: "diogo" });
  const prof = await User.findOne({ username: "professor" });
  const aluno = await User.findOne({ username: "aluno" });

  Task.deleteMany({}).catch(function (err) { });
  const tasks = [
      {
          name: "Task 1",
          usersAssigned: [bruno._id],
          progress: 33,
          priority: "LOW",
          beginDate: new Date().setDate(new Date().getDate()+4),
          endDate: new Date().setDate(new Date().getDate()+6),
          
      },
      {
          name: "Task 2",
          usersAssigned: [ miguel._id, lucas._id],
          progress: 15,
          priority: "MEDIUM",
          beginDate: new Date().setDate(new Date().getDate()+3),
          endDate: new Date().setDate(new Date().getDate()+5),
      },
      {
          name: "Task 3",
          usersAssigned: [bruno._id, miguel._id, lucas._id, miguelS._id, diogo._id],
          progress: 66,
          priority: "URGENT",
          beginDate: new Date().setDate(new Date().getDate()+10),
          endDate: new Date().setDate(new Date().getDate()+11),
      },{
        name: "Task 4",
        usersAssigned: [prof._id, aluno._id],
        progress: 66,
        priority: "HIGH",
        beginDate: new Date().setDate(new Date().getDate()),
        endDate: new Date().setDate(new Date().getDate()+2),
      },{
        name: "Task 5",
        usersAssigned: [prof._id, aluno._id],
        progress: 66,
        priority: "LOW",
        beginDate: new Date().setDate(new Date().getDate()+2),
        endDate: new Date().setDate(new Date().getDate()+6),
      }
  ];

  for (let i = 0; i < tasks.length; i++) {
      const task = new Task(tasks[i]);
      await task.save().catch(function (err) { });
  }

  await Team.deleteMany({}).catch(function (err) { });
  const testTeams = [
      {
          name: "Team 1",
          members: [bruno._id]
      },
      {
          name: "Team 2",
          members: [bruno._id, miguel._id, lucas._id]
      },
      {
          name: "Team 3",
          members: [bruno._id, miguel._id, lucas._id, miguelS._id, diogo._id]
      }
  ];
  for (let i = 0; i < testTeams.length; i++) {
      const team = new Team(testTeams[i]);
      await team.save().catch(function (err) { });
  }

  const checkteams = await Team.find({});

  await Project.deleteMany({}).catch(function (err) { });
  const testProject = [
      {
          name: "Project 1",
          acronym: "PT1",
          linkedTeam: checkteams[0].id,
          beginDate: new Date().setDate(new Date().getDate()+10),
          endDate: new Date().setDate(new Date().getDate()+11)
      },
      {
          name: "Project 2",
          acronym: "PT2",
          beginDate: new Date().setDate(new Date().getDate()+10),
      },
      {
          name: "Project 3",
          acronym: "PT3",
          beginDate: new Date().setDate(new Date().getDate()+10),
      },
  ];
  for (let i = 0; i < testProject.length; i++) {
      const proj = new Project(testProject[i]);
      await proj.save().catch(function (err) { });
  }
  const equipa = await Team.findOne({ name: "Team 1" });
  await Reunion.deleteMany({}).catch(function (err) { });
  const testReunion = [
      {
          possibleTeam: equipa._id,
          members: [bruno._id, lucas._id],
          beginDate: new Date().setHours(10,0,0,0),
          endDate: new Date().setHours(13,0,0,0)
      },
      {
          members: [miguel._id],
          beginDate: new Date().setHours(12,0,0,0),
          endDate: new Date().setHours(15,0,0,0)
      },
      {
          members: [bruno._id],
          beginDate: new Date().setHours(16,0,0,0),
          endDate: new Date().setHours(17,0,0,0)
      }
      
  ];
  for (let i = 0; i < testReunion.length; i++) {
      const reun = new Reunion(testReunion[i]);
      await reun.save().catch(function (err) { console.log(err)});
  }
  Unavailability.deleteMany({}).catch(function (err) { });
  const unavailables = [
    {
       user: bruno._id,
       beginDate: new Date(2022,5,22,12,0,0),
       endDate: new Date(2022,5,22,16,0,0),
    },
    {
      user: bruno._id,
      beginDate: new Date(2022,7,22,9,30,0),
      endDate: new Date(2022,7,22,11,0,0),
    },
    {
      user: bruno._id,
      beginDate: new Date(2022,6,5,14,0,0),
      endDate: new Date(2022,6,5,17,30,0),
    },
    {
      user: miguel._id,
      beginDate: new Date(2022,5,5,14,0,0),
      endDate: new Date(2022,5,5,17,30,0),
    },
    {
      user: miguel._id,
      beginDate: new Date(2022,5,15,14,0,0),
      endDate: new Date(2022,5,15,17,30,0),
    }
    
    
];
for (let i = 0; i < unavailables.length; i++) {
  const unavailableR = new Unavailability(unavailables[i]);
  await unavailableR.save().catch(function (err) { console.log(err)});
}
}

init()
module.exports = function (dbI) {
  router.post("/login", async (req, res) => {
    if (req.body.username == undefined || req.body.password == undefined) {
      res.status(400);
      res.json({ err: "Empty Request" });
      return;
    }
    var user = await User.findOne({ username: req.body.username });
    if (user == null) {
      res.status(401);
      res.json({ err: "Usuário ou senha incorretos" })
      return;
    }
    user = user.toObject();
    if (user.username != req.body.username || user.password != SHA_256(req.body.password)) {
      res.status(401);
      res.json({ err: "Usuário ou senha incorretos" })
      return;
    }
    delete user.password;
    const accessToken = generateAccessToken({ id: user._id, username: user.username, role: user.role });
    const refreshToken = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.REFRESH_TOKEN_SECRET);
    var i = await User.updateOne(
      { _id: user._id },
      { $set: { refreshToken: refreshToken, accessToken: accessToken } }
    ).catch(function (err) {
      res.status(401);
      res.json({ err: "Updating error" })
      return;
    })

    res.json({ id: user._id, username: user.username, role: user.role, accessToken: accessToken, refresh_token: refreshToken });
  });

  router.post("/refresh_token", authenticateToken, async (req, res) => {
    var user = await User.findOne({ username: req.user.username });
    if (user.refreshToken == null) return res.sendStatus(401);
    user = user.toObject();
    const exists = user.refreshToken;
    if (!exists) return res.sendStatus(403);
    jwt.verify(exists, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) return res.sendStatus(403);
      delete user.password;
      const accessToken = generateAccessToken({ id: user.id, username: user.username, role: user.role });
      await User.updateOne(
        { _id: user.id },
        { $set: { accessToken: accessToken } }
      ).catch(function (err) {
        res.status(401);
        res.json({ err: "Updating error" })
        return;
      }).then(function (res) {
        console.log(res)
      })
      res.json({ accessToken: accessToken });

    });
  });

  router.post("/logout", authenticateToken, async (req, res) => {
    await User.updateOne(
      { username: req.user.username },
      { $unset: { refreshToken: 1, accessToken: 1 } }
    )
      .then(function (response) {
        if (response.matchedCount == 0)
          res.json({ err: "The given User does not exist" });
        else res.json(response);
        return;
      })
      .catch(function (err) {
        res.json({ err: "error" });
        return;
      });
    //res.sendStatus(200)
  });


  router.post("/createuser/add", authenticateToken, async (req, res) => {
    if (req.user.role != "ADMIN") return res.sendStatus(401);
    const userExists = await User.exists({ username: req.body.username })
      .catch(function (err) {
        res.status(404);
        res.json({ err: "Internal error." })
        return;
      });
    if (!userExists) {
      await User.create(
        {
          username: req.body.username,
          password: SHA_256(req.body.password),
          role: req.body.role
        }
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
      res.json({ err: "User with the selected name already exists" })
    }
    //res.sendStatus(200)
  });


  router.put("/updateproject/:id", authenticateToken, async (req, res) => {
    console.log(req.params.id)
    console.log(req.body.linkedTeam)
    if (req.body.linkedTeam.length == 0) {
      await Project.updateOne({ _id: req.params.id }, { $unset: {linkedTeam: ""}})
      .then(function (response) {
        if (response.matchedCount == 0){
          console.log("Dont exist")
          res.status(404)
          res.json({msg: "Project doesn't exist on DB."})
        } else {
          console.log("All good")
          console.log(response)
          res.json({msg: "Project linkedteam cleared on DB updated."})
        }
      }).catch(function(exception){
        console.log("VERY BAD")
        res.status(500)
        res.json({msg: "Couldnt update project", error: exception.message})
      });
    } else {
      await Project.updateOne({ _id: req.params.id }, { $set: {linkedTeam: req.body.linkedTeam}})
      .then(function (response) {
        if (response.matchedCount == 0){
          console.log("Dont exist")
          res.status(404)
          res.json({msg: "Project doesn't exist on DB."})
        } else {
          console.log("All good")
          console.log(response)
          res.json({msg: "Project linkedteam info on DB updated."})
        }
      }).catch(function(exception){
        console.log("VERY BAD")
        res.status(500)
        res.json({msg: "Couldnt update project", error: exception.message})
      });
    }
  });

  router.post("/createproject/add", authenticateToken, async (req, res) => {
    const projectExists = await Project.exists({ name: req.body.name })
      .catch(function (err) {
        res.status(404);
        res.json({ err: "Internal error." })
        return;
      });
    if (!projectExists) {
      await Project.create(
        {
          name: req.body.name,
          acronym: req.body.acronym,
          beginDate: req.body.beginDate,
          endDate: req.body.endDate
        }
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
      res.json({ err: "Project with the selected name already exists." })
    }
  });

  return router;
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.accessToken_SECRET, { expiresIn: 5 * 60 });
}


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

function SHA_256(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}