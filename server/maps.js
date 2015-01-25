var levels = [{
    level: 0,
    map: [
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,9,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,8,0],
      [0,0,0,0,0,0,0,0,0,0]
    ],
    chests: {},
    bridges: [],
    players: [
      {
        sprite: '1',
        h: 1,
        v: 1,
        inventory: 0
      },
      {
        sprite: '2',
        h: 3,
        v: 2,
        inventory: 0
      },
      {
        sprite: '3',
        h: 7,
        v: 4,
        inventory: 7
      },
      {
        sprite: '4',
        h: 1,
        v: 5,
        inventory: 0
      }
    ],
    stats: {
      startTime: Date.now(),
      endTime: null,
      turns: 0
    }
  },{
    level: 1,
    map: [
      [5,0,0,0,5,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,10,0],
      [0,0,0,0,0,0,0,0,10,9],
      [0,0,0,15,0,0,5,0,10,0],
      [0,5,0,0,0,0,0,0,10,0],
      [15,0,0,0,5,0,0,0,0,8]
    ],
    chests: {
      "0_0": 14,
      "0_4": 0,
      "4_1": 11,
      "3_6": 0,
      "5_4": 7
    },
    bridges: [],
    players: [
      {
        sprite: '1',
        h: 1,
        v: 1,
        inventory: 0
      },
      {
        sprite: '2',
        h: 3,
        v: 2,
        inventory: 0
      },
      {
        sprite: '3',
        h: 7,
        v: 4,
        inventory: 0
      },
      {
        sprite: '4',
        h: 1,
        v: 5,
        inventory: 0
      }
    ],
    stats: {
      startTime: Date.now(),
      endTime: null,
      turns: 0
    }
  }];

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

exports.levels = levels;
exports.clone = clone;
exports.cloneLevel = function(levelIndex){
  return clone(levels[levelIndex]);
}
