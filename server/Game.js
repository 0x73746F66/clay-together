// Game.js
// var exports = module.exports = {};

exports.save = function (data, callback) {
  var game = data;
  return callback(null, game);
};

exports.find = function (id, callback) {
  var response = {
    map: [
      [0,1,0,2,5],
      [0,0,4,0,8],
      [3,0,0,5,0]
    ],
    inventories: {
      player_red: [],
      player_blue: [7],
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
      id: id,
      turn: 0
    }
  };
  return callback(null,response);
};

exports.findById = function (id, callback) {
  var game = {id: id, name:"something"};
  return callback(null,game);
};

exports.remove = function (id, callback) {

  return callback(null);
};
