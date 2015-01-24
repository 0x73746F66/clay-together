var maps = require('./maps.js');
var dataset = {
      empty: 0,
      player_red: 1,
      player_blue: 2,
      player_yellow: 3,
      player_green: 4,
      full_chest: 5,
      empty_chest: 6,
      key: 7,
      door: 8,
      fire: 9,
      water: 10,
      bucket: 11,
      extinguisher: 12
  };

var PLAYER_COUNT = 4;

function nextTurn(gamestate){
  var map = gamestate.map;
  var actions = gamestate.pendingActions;

  var playersNext = [];

  for(var i=0; i<PLAYER_COUNT; i++){
    console.log('processing player ' + i);
    if(actions[i]){
      var actionParsed = /([^_1-9]+)_?(\d+)?_(\d+)?/.exec(actions[i]);
      console.log(actionParsed);
      if(actionParsed[1] == 'move' && map[actionParsed[3]][actionParsed[2]] == dataset.empty){
        gamestate.players[i].h = parseInt(actionParsed[2]);
        gamestate.players[i].v = parseInt(actionParsed[3]);
        console.log('player ' + i + ' moved');
      }
    }
  }

  gamestate.pendingActions = {};
  gamestate.instance.turn++;
}

exports.create = function (id){
  var gamestate = maps.cloneLevel('testLevel');
  gamestate.dataset = dataset;
  gamestate.instance = {
    id: id,
    turn: 0
  };
  gamestate.profile = 0;
  gamestate.pendingActions = {};

  return gamestate;
}

exports.submitAction = function(gameState, playerId, action){
  console.log("submitted action " + action);
  gameState.pendingActions[playerId] = action;

  if(Object.keys(gameState.pendingActions).length >= PLAYER_COUNT){
    nextTurn(gameState);
  }
  return gameState;
}
