var levels = {

  testLevel: {
    complete: false,
    map: [
      [5,0,0,0,5,0,0,0,15,0],
      [0,0,0,0,0,0,0,0,10,0],
      [0,0,0,0,0,0,0,0,10,9],
      [0,0,0,15,0,0,5,0,10,0],
      [5,0,0,0,0,0,0,0,10,0],
      [15,0,0,0,5,0,0,0,10,8]
    ],
    chests: {
      "0_0": 14,
      "0_4": 0,
      "4_0": 11,
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
        h: 9,
        v: 0,
        inventory: 0
      }
    ]
  }
}

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

exports.cloneLevel = function(mapName){
  return clone(levels[mapName]);
}
