var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var router     = express.Router();
var port       = process.env.PORT || 3000; // set our port
var version    = '0.0.1-dev';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/play', express.static(__dirname + '/client'));
app.use('/phaser', express.static(__dirname + '/phaser'));
app.use('/phaser/offline.appcache', function(req, res) {
  res.setHeader("Content-Type", "text/cache-manifest");
  res.send('CACHE MANIFEST\n\
    # v'+version+'\n\
    CACHE:\n\
    favicon.ico\n\
    index.html\n\
    assets/css/style.css\n\
    assets/core/global.js\n\
    assets/core/PhaserGame.js\n\
    assets/lib/phaser-2.2.2.min.js\n\
    assets/stage/1/background-640x360.jpg\n\
    assets/stage/1/config.json\n\
    assets/stage/1/basketball.png\n\
    assets/stage/1/paddle.png\n\
    assets/stage/2/background-640x360.jpg\n\
    assets/stage/2/paddle.png\n\
    assets/stage/2/config.json\n\
    assets/stage/2/cod.png\n\
    assets/stage/3/background-640x360.jpg\n\
    assets/stage/3/config.json\n\
    assets/stage/4/background-640x360.jpg\n\
    assets/stage/4/config.json\n\
    assets/stage/bonus/exp/background-640x360.jpg\n\
    assets/stage/bonus/exp/config.json\n\
    assets/stage/bonus/power/background-640x360.jpg\n\
    assets/stage/bonus/power/config.json\n\
    assets/stage/event/xmas/background-640x360.jpg\n\
   assets/stage/event/xmas/config.json\n\
   NETWORK:\n\
    *\
  ');
});

// middleware to use for all requests
router.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

var Game      = require('./Game.js');

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /start
// ----------------------------------------------------
router.route('/start/')
  .post(function(req, res) {
    Game.save(req.body, function(err, game) {
      if (err){
        res.send(err);
        return;
      }

      res.json(game);
    });
  });
router.route('/start/:game_id')
  .get(function(req, res) {
    Game.find(req.body.game_id,function(err, games) {
      if (err){
        res.send(err);
        return;
      }

      res.json(games);
    });
  });

router.route('/game/:game_id')
  .get(function(req, res) {
    Game.findById(req.params.game_id, function(err, game) {
      if (err){
        res.send(err);
        return;
      }
      res.json(game);
    });
  })
  .put(function(req, res) {
    Game.findById(req.params.game_id, function(err, game) {
      if (err){
        res.send(err);
        return;
      }

      game.name = req.body.name;
      Game.save(game, function(err) {
        if (err){
          res.send(err);
          return;
        }

        res.json({ message: 'Game updated!' });
      });
    });
  })
  .delete(function(req, res) {
    Game.remove(req.params.game_id, function(err) {
      if (err){
        res.send(err);
        return;
      }

      res.json({ message: 'Successfully deleted' });
    });
  });


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
