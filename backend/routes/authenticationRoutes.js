const { response } = require("express");
const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
var crypto = require('crypto');
const User = require("../models/User");
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
];


async function init() {
  // await User.collection.drop();
  // await User.deleteMany({})

  for (let i = 0; i < users.length; i++) {
    const user = new User(users[i]);
    await user.save().catch(function (err) { });
  }
  //   await User.create({
  //     username: "bruno",
  //     password: SHA_256("bruno"), 
  //     role: "admin",
  //   })
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
      res.json({ err: "User with the selected name already exists." })
    }
    //res.sendStatus(200)
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