const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const fs = require('fs');

app.get('/pets', function (req, res) {
  fs.readFile('pets.json', 'utf8', function (err, petsJSON) {
    if (err) {
      console.error(err.stack);
      res.set('Content-Type', 'text/plain').status(404).send('Not Found');
    }
    var pets = JSON.parse(petsJSON);
    res.set('Content-Type', 'application/json').status(200).send(pets);
  })
  return;
})

app.get('/pets/:id', function(req, res) {
  fs.readFile('pets.json', 'utf8', function(err, petsJSON){
    if (err) {
      console.error(err.stack);
      res.set('Content-Type', 'text/plain').status(404).send('Not Found');
    }

    var id = parseInt(req.params.id);
    var pets = JSON.parse(petsJSON);

    if (id < 0 || id >= pets.length || isNaN(id)) {
      res.set('Content-Type', 'text/plain').status(404).send('Not Found');
    }

    res.send(pets[id]);
  });
  return;
});


app.listen(port, function() {
  console.log('Listening on port', port);
});

module.exports = app;
