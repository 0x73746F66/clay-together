var map_cells_x = 10;
var map_cells_y = 6;

var this_player = null;

var this_player_x;
var this_player_y;

var action;

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

function drawMapEntities(response){
  for(var i=0; i<response.map.length; i++){
    for(var j=0; j<response.map[0].length; j++){
      if(response.map[i][j] != response.dataset.empty){
        $("#map_cell_" + i + "_" + j).append('<img src="objects/' + response.map[i][j] + '.png" class="map_object"/>');
        if(this_player == response.map[i][j]){
          this_player_x = j;
          this_player_y = i;
        }
      }
    }
  }
}

function drawInventory(inventories){
  drawInventoryForPlayer('player_red', inventories.player_red);
  drawInventoryForPlayer('player_blue', inventories.player_blue);
  drawInventoryForPlayer('player_yellow', inventories.player_yellow);
  drawInventoryForPlayer('player_green', inventories.player_green);
}

function getNeighboringEmptyCells(x, y){
  return $('#map_cell_' + (y-1) + "_" + x + ':empty,' +
    '#map_cell_' + (y+1) + "_" + x + ':empty,' +
    '#map_cell_' + y + "_" + (x-1) + ':empty,' +
    '#map_cell_' + y + "_" + (x+1) + ':empty');
}

function actionMoveClick(){
	getNeighboringEmptyCells(this_player_x, this_player_y).addClass('cell_choosable');
	action = 'move';
}

function actionMoveDrop(){
	getNeighboringEmptyCells(this_player_x, this_player_y).addClass('cell_choosable');
	action = 'drop';
}

function drawInventoryForPlayer(player, items){
  var itemHtml = '';
  for(var i=0; i<items.length; i++){
    itemHtml += '<img src="objects/' + items[i] + '.png" class="inventory_object"/>';
  }
  $('#' + player + 'r_inventory').append(itemHtml);
}

function handleRefresh(data){
  this_player = data.dataset.player_red;
  clearMap();
  drawMapEntities(data);
  clearInventory();
  drawInventory(data.inventories);
}

function chooseCell(){
	var xy = /\d+_\d+/.exec(this.id);
	action += '_' + xy[0];
	sendAction();
	$('.cell_choosable').removeClass('cell_choosable');
}

function sendAction(){
	alert(action);
	action = "";
}

$(document).ready(function(){
	drawMapGrid(map_cells_x,map_cells_y);
	$.getJSON('/api/start').success(handleRefresh);


	$('#action_move').click(actionMoveClick);
	$('#action_drop').click(actionMoveDrop);
	$('#map_panel').on('click', '.cell_choosable', chooseCell);

});
