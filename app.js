const express = require('express');
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
const bp = require('body-parser');
const mysql = require('./public/dbcon.js');

const app = express();

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('mysql', mysql);
app.set('port', process.argv[2]);


app.use('/static', express.static('public'));
app.use('/', express.static('public'));


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



app.get('/', (req, res, next) =>{
  let context = {};
  mysql.pool.query(mysql.SELECT, (err, rows, fields) => {
    if (err) {
      console.log(`Failed to query entries: \n${err}`);
      next(err);
      return;
    }
    console.log('beep beep boop beep');
    context.results = rows;
    context.results.forEach((entry) => {
      if (entry.lbs === null || entry.lbs === 1) {
        entry.lbs = 'lbs';
      } else {
        entry.lbs = 'kgs';
      }
    });
    console.log(context);
    // DON'T SET TYPE OR HTML WILL NOT RENDER
    // res.type('application/json');
    // res.type('html');
    // res.send(rows);
    res.render('home', context);
  });
});

// app.get('/cow',(req, res, next)=>{
//   res.send(`This is the cow.  MOOOOOO!!!!!!`);
// });

app.get('/add', (req, res, next) => {
  console.log(req.body);
  inserts = [req.body.name, Number(req.body.reps), Number(req.body.weight), req.body.date, req.body.lbs];
  console.log(inserts);
  mysql.pool.query(mysql.INSERT, inserts, (err, rows, next)=>{
    if(err) {
      console.log(err);
    }
  });
  res.send(JSON.stringify(context));
  // res.redirect('/');
});

app.post('/add', (req, res, next)=>{
  console.log(req.body);
  inserts = [req.body.name, Number(req.body.reps), Number(req.body.weight), req.body.date, req.body.lbs];
  console.log(inserts);
  mysql.pool.query(mysql.INSERT, inserts, (err, rows, next)=>{
    if(err) {
      console.log(err);
    }
    console.log(rows);
  });
 
  res.redirect('/');
});

app.get('/delete/:id', (req,res,next)=>{
  console.log(`You want to delete ${req.params.id}`);
  mysql.pool.query(mysql.DELETE, [req.params.id],(err, rows, fields)=>{
    if(err) {
      console.log(err);
    }
    else {
      console.log(rows);
    }
  });
  res.redirect('/');
});

app.get('/reset-table', function (req, res, next) {
  var context = {};
  mysql.pool.query(mysql.DROP, function (err) { //replace your connection pool with the your variable containing the connection pool
    mysql.pool.query(mysql.CREATE, function (err) {
      context.results = "Table reset";
      res.render('home');
      // res.redirect('/');
    })
  });
  console.log('Table Reset');
});

app.use((req, res) => {
  res.status(404);
  res.render('404');
});

app.use((err, req, res, next) => {
  res.type('plain/html');
  res.status(500);
  res.render('500');
});


app.listen(app.get('port'), () => {
  console.log(`Server Started on port # ${app.get('port')}\nPress control-c to terminate.`);
});