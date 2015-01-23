var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 3000; // set our port
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

var Game = function(){
  this.name;
  return this;
};
Game.prototype = {
  save: function(callback){

  },
  get: function(callback){

  },
  find: function(callback){

  },
  findById: function(id, callback){

  },
  remove: function(callback){

  }
}

// on routes that end in /start
// ----------------------------------------------------
router.route('/start')
  // create a game (accessed at POST http://localhost:3000/start)
  .post(function(req, res) {
    Game.name = req.body.name;

    Game.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'game created!' });
    });
  })
  // get all the games (accessed at GET http://localhost:3000/api/games)
  .get(function(req, res) {
    Game.find(function(err, games) {
      if (err)
        res.send(err);

      res.json(games);
    });
  });

// on routes that end in /games/:game_id
// ----------------------------------------------------
router.route('/games/:gameid')
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
      game.save(function(err) {
        if (err)
          res.send(err);

        res.json({ message: 'Game updated!' });
      });

    });
  })
  .delete(function(req, res) {
    Game.remove({
      _id: req.params.game_id
    }, function(err, game) {
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
