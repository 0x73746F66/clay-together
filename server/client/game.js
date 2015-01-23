var sampleData = { /* Delete once server connection works */
	map: [
		[0,1,0,2,5],
		[0,0,4,0,8],
		[3,0,0,5,0]
	],
	inventories: {
		red: [],
		blue: [7],
		yellow: [],
		green: []
	}
}



var objectIds = {
	empty: 0,
	player_red: 1,
	player_blue: 2,
	player_yellow: 3,
	player_green: 4,
	full_chest: 5,
	empty_chest: 6,
	key: 7,
	door: 8
}

var map_cells_x = 10;
var map_cells_y = 6;

var this_player = objectIds.player_red;

function drawMapGrid(width, height){
	var mapHtml = "";
	for(var i=0; i<height; i++){
		mapHtml += '<div class="map_row">';
		for(var j=0; j<width; j++){
			mapHtml += '<span class="map_cell" id="map_cell_' + i + "_" + j + '"/>';
		}
		mapHtml += '</div>';
	}
	$('#map_panel').append(mapHtml);
}

function clearMap(){
	$(".map_cell").empty();
}

function clearInventory(){
	$(".player_inventory").empty();
}

function drawMapEntities(map){
	for(var i=0; i<map.length; i++){
		for(var j=0; j<map[0].length; j++){
			if(map[i][j] != objectIds.empty){
				$("#map_cell_" + i + "_" + j).append('<img src="objects/' + map[i][j] + '.png" class="map_object"/>');
			}
		}
	}
}

function drawInventory(inventories){
	drawInventoryForPlayer('red', inventories.red);
	drawInventoryForPlayer('blue', inventories.blue);
	drawInventoryForPlayer('yellow', inventories.yellow);
	drawInventoryForPlayer('green', inventories.green);
}

function drawInventoryForPlayer(color, items){
	var itemHtml = '';
	for(var i=0; i<items.length; i++){
		itemHtml += '<img src="objects/' + items[i] + '.png" class="inventory_object"/>';
	}
	$('#player_inventory_' + color).append(itemHtml);
}

function handleRefresh(data){
	clearMap();
	drawMapEntities(data.map);
	clearInventory();
	drawInventory(data.inventories);
}

$(document).ready(function(){
	drawMapGrid(map_cells_x,map_cells_y);
	handleRefresh(sampleData);
	//window.setTimeout(2);
});