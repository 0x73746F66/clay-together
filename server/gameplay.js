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
      door: 8
  };

var PLAYER_COUNT = 2;

function nextTurn(gamestate){
	var map = gamestate.map;
	var actions = gamestate.pendingActions;

	var playersNext = [];

	for(var i=0; i<PLAYER_COUNT; i++){
		console.log('processing player ' + i);
		if(actions[i]){
			var actionParsed = /([^_1-9]+)_?(\d+)?_(\d+)?/.exec(actions[i]);
			if(actionParsed[1] == 'move' && map[actionParsed[2]][actionParsed[3]] == dataset.empty){
				gamestate.players[i].x = parseInt(actionParsed[3]);
				gamestate.players[i].y = parseInt(actionParsed[2]);
				console.log('player ' + i + ' moved');
			}
		}
	}

	gamestate.pendingActions = {};
}

function createGame(id){
	var gamestate = maps.cloneLevel('testLevel');
	gamestate.dataset = dataset;
	gamestate.instance = {
		id: id,
		turn: 0
	};
	gamestate.profile = 1;
	gamestate.pendingActions = {};

	return gamestate;
}

exports.create = function (id){
	return createGame(id);
}

exports.submitAction = function(gameState, playerId, action){
	console.log("submitted action " + action);
	gameState.pendingActions[playerId] = action;

	if(Object.keys(gameState.pendingActions).length >= PLAYER_COUNT){
		nextTurn(gameState);
	}
	return gameState;
}

exports.save = function (data, callback) {
  var game = data;
  return callback(null, game);
};

exports.find = function (id, callback) {
	var gameState = games[id];
	var response = {
		map: gameState.map,
		inventories: gameState.inventories,
		dataset: dataset,
		instance: gameState.instance
	}
	return callback(null,response);
};

exports.remove = function (id, callback) {

  return callback(null);
};
