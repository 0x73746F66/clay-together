var levels = {

	testLevel: {
		map: [
	      [0,0,0,0,5],
	      [5,0,0,0,8],
	      [0,0,0,5,0]
	    ],
	    players: [
	    	{
	    		sprite: '1',
	    		x: 0,
	    		y: 1,
	    		inventory: []
	    	},
	    	{
	    		sprite: '2',
	    		x: 3,
	    		y: 2,
	    		inventory: [7]
	    	},
	    	{
	    		sprite: '3',
	    		x: 4,
	    		y: 4,
	    		inventory: []
	    	},
	    	{
	    		sprite: '4',
	    		x: 5,
	    		y: 5,
	    		inventory: []
	    	},
	    ]
	}

}

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

exports.cloneLevel = function(mapName){
	return clone(levels[mapName]);
}