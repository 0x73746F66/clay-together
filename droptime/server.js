var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var router     = express.Router();
var port       = process.env.PORT || 3001; // set our port
var version    = '0.0.5';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/droptime', express.static(__dirname + '/client'));
app.use('/droptime/offline.appcache', function(req, res) {
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

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Version ' + version);
console.log('Magic happens on port ' + port);
