var levels = {

	testLevel: {
		map: [
	      [0,0,0,0,5,0,0,0,0,0],
	      [5,0,0,0,8,0,0,0,0,0],
	      [0,0,0,0,0,0,0,0,0,0],
	      [0,0,0,0,0,0,5,0,0,0],
	      [0,0,0,0,0,0,0,0,0,0],
	      [0,0,0,0,0,0,0,0,0,0]
	    ],
	    players: [
	    	{
	    		sprite: '1',
	    		h: 1,
	    		v: 0,
	    		inventory: []
	    	},
	    	{
	    		sprite: '2',
	    		h: 3,
	    		v: 2,
	    		inventory: [7]
	    	},
	    	{
	    		sprite: '3',
	    		h: 4,
	    		v: 4,
	    		inventory: []
	    	},
	    	{
	    		sprite: '4',
	    		h: 5,
	    		v: 5,
	    		inventory: []
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