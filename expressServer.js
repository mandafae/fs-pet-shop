const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const fs = require('fs');
const bodyParser = require('body-parser')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


// Create function to read pets file
function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile('./pets.json', 'utf8', (err, data) => {
      if (err) throw err;
      resolve(JSON.parse(data));
    });
  });
}


// Display all pets
app.get('/pets', function (req, res) {
  readFile().then((info) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(info));
    });
  return;
})


// Display pet by ID
app.get('/pets/:id', function(req, res) {
  var id = parseInt(req.params.id);
  readFile().then((info) => {
    if (id < 0 || id >= info.length || isNaN(id)) {
      res.set('Content-Type', 'text/plain').status(404).send('Not Found');
    } else {
      res.send(info[id]);
    };
  });
  return;
});


// POST request
app.post('/pets', function(req, res) {
  let newPet = req.body;
  if (!newPet || !newPet.name || !newPet.kind || !/^\d*$/.test(newPet.age)) {
    res.set('Content-Type', 'text/plain').status(400).send('Bad Request');
  } else {
    readFile().then ((info) => {
    info.push(newPet);
    fs.writeFile('pets.json', JSON.stringify(info), function(err) {
      if (err) throw err;
    })
    res.set('Content-Type', 'application/json').status(200).send(newPet);
  });
};
  return;
});


// Default error handling
app.use(function (req, res, next) {
  res.set('Content-Type', 'text/plain').status(404).send('Not Found');
});


app.listen(port, function() {
  console.log('Listening on port', port);
});

module.exports = app;
