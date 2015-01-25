var levels = [{
    level: 0,
    map: [
      [5,0,0,0,5,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,10,0],
      [0,0,0,0,0,0,0,0,10,9],
      [0,0,0,15,0,0,5,0,10,0],
      [0,5,0,0,0,0,0,0,10,0],
      [15,0,0,0,5,0,0,0,10,8]
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
  },{
    level: 1,
    map: [
      [0,5,0,14,0,0,0,0,0,0],
      [0,0,0,0,14,0,0,0,0,5],
      [0,0,0,0,0,5,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [14,0,0,0,10,10,10,10,9,9],
      [0,14,0,5,10,8,0,0,0,0]
    ],
    chests: {
      "0_1": 15,
      "2_5": 11,
      "1_9": 15,
      "5_3": 0
    },
    bridges: [],
    players: [
      {
        sprite: '1',
        h: 2,
        v: 3,
        inventory: 0
      },
      {
        sprite: '2',
        h: 0,
        v: 5,
        inventory: 7
      },
      {
        sprite: '3',
        h: 0,
        v: 3,
        inventory: 0
      },
      {
        sprite: '4',
        h: 8,
        v: 0,
        inventory: 0
      }
    ],
    stats: {
      startTime: Date.now(),
      endTime: null,
      turns: 0
    }
  },{
    level: 2,
    map: [
      [8,10,0,0,0,0,0,0,15,9],
      [0,10,0,0,0,0,0,0,0,15],
      [10,10,0,0,0,0,0,0,0,0],
      [0,0,14,0,0,0,10,10,10,10],
      [0,0,14,0,0,0,0,0,0,9],
      [0,0,5,5,5,5,0,0,9,15]
    ],
    chests: {
      "5_2": 14,
      "5_3": 11,
      "5_4": 11,
      "5_5": 15
    },
    bridges: [],
    players: [
      {
        sprite: '1',
        h: 0,
        v: 2,
        inventory: 0
      },
      {
        sprite: '2',
        h: 0,
        v: 3,
        inventory: 0
      },
      {
        sprite: '3',
        h: 0,
        v: 4,
        inventory: 0
      },
      {
        sprite: '4',
        h: 0,
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
    level: 3,
    map: [
      [13,0,0,0,10,5,10,0,0,0],
      [0,14,0,0,10,7,10,0,0,0],
      [0,0,14,0,10,10,10,0,0,5],
      [9,0,0,13,0,0,0,0,0,0],
      [8,9,0,0,14,0,0,0,0,5],
      [9,0,0,5,0,14,0,0,0,0]
    ],
    chests: {
      "0_6": 15,
      "5_3": 11,
      "4_9": 15,
      "2_9": 0
    },
    bridges: [],
    players: [
      {
        sprite: '1',
        h: 0,
        v: 9,
        inventory: 0
      },
      {
        sprite: '2',
        h: 1,
        v: 9,
        inventory: 0
      },
      {
        sprite: '3',
        h: 3,
        v: 9,
        inventory: 0
      },
      {
        sprite: '4',
        h: 5,
        v: 9,
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
