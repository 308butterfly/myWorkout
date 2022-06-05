const express = require("express");
const handlebars = require("express-handlebars").create({
  defaultLayout: "main",
  layoutsDir: `${__dirname}/views/layouts`,
  partialsDir: `${__dirname}/views/partials/`,
});
const bp = require("body-parser");
const mysql = require("./public/dbcon.js");
const queries = require("./public/js/queries.js");
const methodOverride = require("method-override");
const dateUtil = require("./public/js/helper");

const app = express();

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("mysql", mysql);
app.set("queries", queries);
app.set("port", process.argv[2] || 5000);

app.use(express.static(__dirname + "/public"));
app.use(express.static("public/assets"));

// DATA FLOW

// Request: Ajax -> Node Server -> MySQL

// Respond: mySQL -> Node Server -> Ajax

// All interactions, other than updating an exercise, should happen via Ajax.
// This means that at no time should the page refresh.
// Instead Ajax calls should be used to GET or POST to the server
// and it should use the data the server provides to update the page.

// TODO RESTFUL ROUTING
// ? name       url              http verb         desc
// * ==========================================================
// ! INDEX      /dogs               GET     Display list of dogs
// ! NEW        /dogs/new           GET     Display form to make new dog
// ! CREATE     /dogs/              POST    Add new dog to DB Where NEW submits to then redirect
// ! SHOW       /dogs/:id           GET     Shows info about specific dog
// ! EDIT       /dogs/:id/edit      GET     Show edit for specific dog
// ! UPDATE...../dogs/:id           PUT     Update specific dog, then redirect
// ! DESTROY    /dogs/:id           DELETE  Delete a dog, then redirect

app.use(methodOverride("_method"));

app.get("/", (req, res, next) => {
  let context = {};
  mysql.pool.query(queries.SELECT, (err, results, fields) => {
    if (err) {
      console.log(`Failed to query entries: \n${err}`);
      next(err);
      return;
    }
    console.log("In get all entries route");
    context.results = results;
    context.results.forEach((entry) => {
      let date = new Date(entry.date.toString());
      entry.date = dateUtil.mmddyyyy(date);
    });
    res.type("html");
    res.render("home", context);
  });
});

// * add workout to db
app.post("/workout", (req, res, next) => {
  let context = {};
  console.log(req.body);
  inserts = [
    req.body.name,
    Number(req.body.reps),
    Number(req.body.weight),
    req.body.date,
    req.body.lbs,
  ];
  console.log(inserts);
  mysql.pool.query(queries.INSERT, inserts, (err, results, next) => {
    if (err) {
      console.log(err);
      return;
    }
    context = {
      id: results.insertId,
      name: inserts[0],
      reps: inserts[1],
      weight: inserts[2],
      date: dateUtil.fwdSlash_mmddyyyy(inserts[3]),
      lbs: inserts[4],
    };
    res.type("plain/html");
    res.render("partials/tblRow", {
      layout: false,
      ...context,
    });
  });
});

// ? update entry
app.put("/workout/:id", (req, res) => {
  let context = {};

  mysql.pool.query(
    queries.UPDATE,
    [
      req.body.name,
      req.body.reps,
      req.body.weight,
      req.body.date,
      req.body.lbs,
      req.body.id,
    ],
    (err, result) => {
      if (err) {
        res.send(err);
      }
      context = {
        id: req.body.id,
        name: req.body.name,
        reps: req.body.reps,
        weight: req.body.weight,
        date: dateUtil.fwdSlash_mmddyyyy(req.body.date),
        lbs: req.body.lbs,
      };

      res.type("plain/html");
      res.render("partials/tblRow", {
        layout: false,
        ...context,
      });
    }
  );
});

// ! delete entry
app.delete("/workout/:id", (req, res, next) => {
  let context = {};
  mysql.pool.query(queries.DELETE, [req.params.id], (err, results, fields) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Entry ${req.params.id} DELETED!`);
    console.log(`Deleted ${results.affectedRows} rows`);

    res.sendStatus("200");
  });
});

app.get("/reset-table", function (req, res, next) {
  var context = {};
  mysql.pool.query(queries.DROP, function (err) {
    //replace your connection pool with the your variable containing the connection pool
    mysql.pool.query(queries.CREATE, function (err) {
      context.results = "Table reset";
      req.send(context);
    });
  });
  console.log("Table Reset");
});

app.use((req, res) => {
  res.type("plain/html");
  res.status(404);
  res.render("404");
});

app.use((err, req, res, next) => {
  res.type("plain/html");
  res.status(500);
  res.render("500");
});

app.listen(app.get("port"), () => {
  console.log(
    `Server Started on port # ${app.get("port")}\nPress control-c to terminate.`
  );
});
