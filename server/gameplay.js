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
  var movePairs = [];

	for(var i=0; i<PLAYER_COUNT; i++){
		console.log('processing player ' + i);
		var current_hv = gamestate.players[i].h + '_' + gamestate.players[i].v;
		movePairs[i] = [ current_hv, current_hv ];

		if(actions[i]){
			var actionParsed = /([^_1-9]+)_?(\d+)?_?(\d+)?/.exec(actions[i]);

			if('move' == actionParsed[1] && map[actionParsed[3]][actionParsed[2]] == dataset.empty){
				var next_hv = actionParsed[2] + '_' + actionParsed[3];
				movePairs[i] = [ current_hv, next_hv ];
			}
		}
	}

	var bestMoveResolution = moveResolver(movePairs);
	for(var i=0; i<PLAYER_COUNT; i++){
		var newLocation = movePairs[i][bestMoveResolution[i]];
		gamestate.players[i].h = parseInt(newLocation.split('_')[0]);
		gamestate.players[i].v = parseInt(newLocation.split('_')[1]);
		console.log('player ' + i + ' moved to ' + newLocation);
	}

	gamestate.pendingActions = {};
	gamestate.instance.turn++;
}


function moveResolver(pairs){
	var combinations = 1 << (pairs.length+1) - 1;
	var bestScore = 0;
	var bestProposal;
	for(var i=0; i < combinations; i++){
		var result = resolve ([i&1, i>>1&1, i>>2&1, i>>3&1], pairs);
		if(result != null && (result.score > bestScore)){
			bestScore = result.score;
			bestProposal = result.proposal;
		}
	}
	return bestProposal
};

function resolve(proposal, pairs){
	var alreadyOccupied = {};
	var score = 0;
	for(var i=0; i<proposal.length; i++){
		if(proposal[i] == 0 && !alreadyOccupied[pairs[i][0]]){
			alreadyOccupied[pairs[i][0]] = true;
		}
		else if (proposal[i] == 1 && !alreadyOccupied[pairs[i][1]]){
			alreadyOccupied[pairs[i][1]] = true;
			score++;
		}
		else{
			return null;
		}
	}
	console.log(proposal + " " + score);
	return {
		score: score,
		proposal: proposal
	}
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
