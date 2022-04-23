const { response } = require("express");
const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
const Hero = require("../models/Hero");
const Pet = require("../models/Pet");

module.exports = function (dbI) {
  router.get("/heroes", async (req, res) => {
    var heroes = await Hero.find({});
    res.json(heroes);
  });
  router.get("/hero/:id", async (req, res) => {
    var hero = await Hero.findById(req.params.id)
      .then(function (response) {
        res.json(response);
      })
      .catch(function (err) {
        res.status(404);
        res.json({ msg: "Not Found" });
      });
  });

  router.put("/hero/:id", async (req, res) => {
    if (
      (req.body.name == undefined && req.body.petID == undefined) ||
      req.body.name == "" ||
      req.params.id == null
    ) {
      res.status(400);
      res.json({ msg: "Bad Request" });
      return;
    }
    if (req.body.petID != "") {
      Hero.updateOne(
        { _id: req.params.id },
        { $set: { petID: req.body.petID, name: req.body.name } }
      )
        .then(function (response) {
          if (response.matchedCount == 0)
            res.json({ msg: "The given Hero does not exist" });
          else res.json(response);
        })
        .catch(function (err) {
          console.log(err);
          res.json({ msg: "Error1!" });
        });
    } else if (req.body.petID == "") {
      Hero.updateOne(
        { _id: req.params.id },
        { $set: { name: req.body.name }, $unset: { petID: 1 } }
      )
        .then(function (response) {
          if (response.matchedCount == 0)
            res.json({ msg: "The given Hero does not exist" });
          else res.json(response);
        })
        .catch(function (err) {
          console.log(err);
          res.json({ msg: "Error2!" });
        });
    }
  });
  router.post("/hero", async (req, res) => {
    if (
      (req.body.name == undefined && req.body.petID == undefined) ||
      req.body.petID == ""
    ) {
      res.status(400);
      res.json({ msg: "Bad Request" });
      return;
    }

    await Hero.create({ name: req.body.name, petID: req.body.petID })
      .then(function (values) {
        res.json(values);
      })
      .catch(function (err) {
        if (err.code == 11000) res.json({ msg: "Hero already exists" });
      });
  });

  router.delete("/hero/:id", (req, res) => {
    if(req.params.id == "undefined"){
    res.json("Cant delete nothing")
    return
    }
    Hero.deleteOne({ _id: req.params.id }).then(function (values) {
      console.log(values);
      res.json({ msg: "Hero Deleted" });
    });
  });
  router.get("/pets", (req, res) => {
    Pet.find({})
      .then(function (response) {
        res.json(response);
      })
      .catch(function (err) {
        res.json({ msg: "Error" });
      });
  });

  router.delete("/pet/:id", (req, res) => {
    console.log(req.params.id);
    Pet.deleteOne({ _id: req.params.id }).then(function (values) {
      console.log(values);
      res.json({ msg: "Pet Deleted" });
    });
  });
  router.post("/pet", async (req, res) => {
    if (req.body.name == undefined || req.body.name == "") {
      res.status(400);
      res.json({ msg: "Bad Request" });
      return;
    }

    var pet = await Pet.create({ name: req.body.name })
      .then(function (values) {
        res.json(values);
      })
      .catch(function (err) {
        if (err.code == 11000) res.json({ msg: "Pet already exists" });
      });
     
  });
  router.get("/pet/:id", (req, res) => {
    Pet.findById(req.params.id)
      .then(function (response) {
        res.json(response);
        console.log(response);
      })
      .catch(function (err) {
        res.json({ msg: "Error" });
      });
  });
  router.get("/init", async (req, res) => {
    await Hero.deleteMany({});
    await Pet.deleteMany({});
    console.log("DataBase Cleared");
    initialHeroes = [
      { name: "Dr Nice" },
      { name: "Narco" },
      { name: "Bombasto" },
      { name: "Celeritas" },
      { name: "Magneta" },
      { name: "RubberMan" },
      { name: "Dynama" },
      { name: "Dr IQ" },
      { name: "Magma" },
      { name: "Tornado" },
    ];
    initialPets = [{ name: "Gato" }, { name: "Girafa" }, { name: "Elefante" }];
    for (let hero of initialHeroes) {
      await Hero.create({ name: hero.name })
        .then(function (values) {
          console.log(values);
        })
        .catch(function (err) {});
    }
    for (let pet of initialPets) {
      await Pet.create({ name: pet.name })
        .then(function (values) {
          console.log(values);
        })
        .catch(function (err) {});
    }
    res.json({ msg: "Database initiated!" });
  });
  return router;
};
