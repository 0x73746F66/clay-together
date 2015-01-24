var levels = {

  testLevel: {
    map: [
        [0,5,0,0,5,0,0,0,0,0],
        [5,0,10,0,0,0,0,0,10,0],
        [0,0,0,0,0,0,0,0,10,9],
        [0,0,0,0,0,0,5,0,10,0],
        [0,0,0,0,0,0,0,0,10,8],
        [0,0,0,0,0,0,0,0,10,0]
      ],
      chests: {
        "0_1": 0,
        "0_4": 7,
        "1_0": 0,
        "3_6": 11
      },
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
          h: 4,
          v: 4,
          inventory: 0
        },
        {
          sprite: '4',
          h: 5,
          v: 5,
          inventory: 12
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
