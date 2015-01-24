var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var router     = express.Router();
var port       = process.env.PORT || 3000; // set our port
var gameplay   = require('./gameplay');

var MemoryStore = {length:0};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/play', express.static(__dirname + '/client'));

// middleware to use for all requests
router.use(function(req, res, next) {
  console.log('Currently ' + MemoryStore.length+' games running');
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {
  res.json({ message: 'Currently ' + MemoryStore.length+' games running' });
});

// on routes that end in /start
// ----------------------------------------------------
router.route('/start/')
  .post(function(req, res) {
    var game = gameplay.create(req.body.id);
    MemoryStore.length = ++MemoryStore.length;
    MemoryStore[req.body.id] = game;
    res.json(game);
  });

router.route('/start/:game_id')
  .get(function(req, res) {
    var game = MemoryStore[req.params.game_id]||{};
    if (game.instance && game.instance.id == req.params.game_id && game.profile < 3){
      // add a new player
      game.profile = ++game.profile;
      console.log('player ' + game.profile + ' joined ' + req.params.game_id);
    } else if (game.profile >= 3) {
      res.json({result:false,error:"game full"});
      return;
    }
    res.json(game);
  });

router.route('/game/:game_id')
  .get(function(req, res) {
    var game = MemoryStore[req.params.game_id];
    res.json(game);
  })
  .put(function(req, res) {
     console.log(req.params.game_id);
     
    var game = MemoryStore[req.params.game_id];
    console.log(game);
    gameplay.submitAction(game, req.body.player_id, req.body.action);
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
