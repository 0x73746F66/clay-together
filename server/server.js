var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var router     = express.Router();
var port       = process.env.PORT || 3000; // set our port

var MemoryStore = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/play', express.static(__dirname + '/client'));

// middleware to use for all requests
router.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /start
// ----------------------------------------------------
router.route('/start/')
  .post(function(req, res) {
    var game = {
      map: [
        [0,1,0,2,5],
        [0,0,4,0,8],
        [3,0,0,5,0]
      ],
      inventories: {
        player_red: [],
        player_blue: [],
        player_yellow: [],
        player_green: []
      },
      dataset: {
        empty: 0,
        player_red: 1,
        player_blue: 2,
        player_yellow: 3,
        player_green: 4,
        full_chest: 5,
        empty_chest: 6,
        key: 7,
        door: 8
      },
      instance: {
        id: req.body.id,
        turn: 0
      }
    };

    MemoryStore[req.body.id] = game;
    res.json(game);
  });

router.route('/start/:game_id')
  .get(function(req, res) {
    var game = MemoryStore[req.body.game_id];
    res.json(game);
  });

router.route('/game/:game_id')
  .get(function(req, res) {
    var game = req.session[req.body.game_id];
    res.json(game);
  })
  .put(function(req, res) {
    var game = MemoryStore[req.body.game_id];
    // modify game
    res.json(game);
  })
  .delete(function(req, res) {
    delete req.session[req.body.game_id]
    res.json({ message: req.body.game_id+' deleted' });
  });

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
