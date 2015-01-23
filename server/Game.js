// Game.js
// var exports = module.exports = {};

exports.save = function (data, callback) {
  var game = data;
  return callback(null, game);
};

exports.find = function (callback) {
  var games = [{data:[1,2]},{data:[3,4]}];
  return callback(null,games);
};

exports.findById = function (id, callback) {
  var game = {id: id, name:"something"};
  return callback(null,game);
};

exports.remove = function (id, callback) {

  return callback(null);
};
