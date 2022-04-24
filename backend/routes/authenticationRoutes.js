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
    password: "bruno",
  },
];


async function init() {
  await User.collection.drop();
  await User.deleteMany({})
  await User.create({
    username: "bruno",
    password: SHA_256("bruno"), 
    role: "admin",
  })
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
      res.json({ err: "Usuário não existe" })
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
      const accessToken = generateAccessToken({ id: user._id, username: user.username, role: user.role });
      console.log(accessToken)
      await User.updateOne(
        { _id: user._id },
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
        console.log(response)
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
  return router;
};
function generateAccessToken(user) {
  return jwt.sign(user, process.env.accessToken_SECRET, { expiresIn: 5 * 60 });
}


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

function SHA_256(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}