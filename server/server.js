var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/play', express.static(__dirname + '/client'));

var port      = process.env.PORT || 3000; // set our port
var router    = express.Router();
var Game      = require('./Game.js');

// middleware to use for all requests
router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /start
// ----------------------------------------------------
router.route('/start')
  .post(function(req, res) {
    Game.save(req.body, function(err, game) {
      if (err)
        res.send(err);

      res.json(game);
    });

    res.json({ message: 'game created!' });
  })
  .get(function(req, res) {
    Game.find(function(err, games) {
      if (err)
        res.send(err);

      res.json(games);
    });
  });

router.route('/game/:game_id')
  .get(function(req, res) {
    Game.findById(req.params.game_id, function(err, game) {
      if (err)
        res.send(err);
      res.json(game);
    });
  })
  .put(function(req, res) {
    Game.findById(req.params.game_id, function(err, game) {

      if (err)
        res.send(err);

      game.name = req.body.name;
      Game.save(game, function(err) {
        if (err)
          res.send(err);

        res.json({ message: 'Game updated!' });
      });

    });
  })
  .delete(function(req, res) {
    Game.remove(req.params.game_id, function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'Successfully deleted' });
    });
  });


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
