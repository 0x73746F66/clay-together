var maps = require('./maps.js');
var dataset = {
      collectables: [7,11,12,14,15,16],
      animated: {
      	"9": {fps: 4, no_of_frames: 2}
      },
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
      extinguisher: 12,
      empty_chest: 13,
      boulder: 14,
      wood: 15,
      planks: 16
  };

var PLAYER_COUNT = 4;

function nextTurn(gamestate){
  var map = gamestate.map;
  var actions = gamestate.pendingActions;
  var movePairs = [];

  for(var i=0; i<PLAYER_COUNT; i++){
    console.log('processing player ' + i);
    var current_hv = gamestate.players[i].h + '_' + gamestate.players[i].v;
    var current_inventory = gamestate.players[i].inventory;
    movePairs[i] = [ current_hv, current_hv ];

    if(actions[i]){
      var actionParsed = /([^_1-9]+)_?(\d+)?_?(\d+)?/.exec(actions[i]);

      if('move' == actionParsed[1] && map[actionParsed[3]][actionParsed[2]] == dataset.empty){
        var next_hv = actionParsed[2] + '_' + actionParsed[3];
        movePairs[i] = [ current_hv, next_hv ];
      }

      if('drop' == actionParsed[1]  && map[actionParsed[3]][actionParsed[2]] == dataset.empty){
        map[actionParsed[3]][actionParsed[2]] = gamestate.players[i].inventory;
        gamestate.players[i].inventory = 0;
      }

      if('interact' == actionParsed[1]){
        if(dataset.full_chest == map[actionParsed[3]][actionParsed[2]]){
        var chest_content = gamestate.chests[actionParsed[3]+'_'+actionParsed[2]];
          map[actionParsed[3]][actionParsed[2]] = dataset.empty_chest;
          gamestate.players[i].inventory = chest_content;
          console.log("Opened chest");
        }
        else if(current_inventory == dataset.bucket && map[actionParsed[3]][actionParsed[2]] == dataset.water){
          gamestate.players[i].inventory = dataset.extinguisher;
          console.log("Collected water");
        }
        else if(current_inventory == dataset.extinguisher && map[actionParsed[3]][actionParsed[2]] == dataset.fire){
          gamestate.players[i].inventory = 0;
          map[actionParsed[3]][actionParsed[2]] = 0;
          console.log("Put out fire");
        }
        else if(current_inventory == dataset.planks && map[actionParsed[3]][actionParsed[2]] == dataset.water){
          gamestate.players[i].inventory = 0;
          map[actionParsed[3]][actionParsed[2]] = 0;
          gamestate.bridges.push(actionParsed[2]+'_'+actionParsed[3]);
          console.log("built bridge");
        }
        else if(current_inventory == dataset.key && map[actionParsed[3]][actionParsed[2]] == dataset.door){
          gamestate.players[i].inventory = 0;
          map[actionParsed[3]][actionParsed[2]] = 0;
          gamestate.complete = true;
          console.log("puzzle complete");
        }
        else if(current_inventory == dataset.wood && map[actionParsed[3]][actionParsed[2]] == dataset.wood){
          gamestate.players[i].inventory = dataset.planks;
          map[actionParsed[3]][actionParsed[2]] = 0;
          console.log("made planks");
        }
        else if (current_inventory == dataset.empty && dataset.collectables.indexOf(map[actionParsed[3]][actionParsed[2]]) !== -1){
          gamestate.players[i].inventory = map[actionParsed[3]][actionParsed[2]];
          map[actionParsed[3]][actionParsed[2]] = dataset.empty;
          console.log("Collected item");
        }
        else {
          console.log("Don't know what to do with this");
        }
      }
    }
  }

  var bestMoveResolution = moveResolver(movePairs);
  for(var i=0; i<PLAYER_COUNT; i++){
    var newLocation = movePairs[i][bestMoveResolution[i]];
    gamestate.players[i].h = parseInt(newLocation.split('_')[0]);
    gamestate.players[i].v = parseInt(newLocation.split('_')[1]);
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
