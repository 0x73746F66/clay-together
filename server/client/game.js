var game_id = 'uuid';
$.ajaxSetup({
   contentType: "application/json",
   dataType: "json"
});

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

function drawPlayers(players){
  for(var i=0; i<players.length; i++){
    $("#map_cell_" + players[i].x + "_" + players[i].y).append('<img src="objects/' + players[i].sprite + '.png" class="map_object player_icon"/>');
  }
}

function drawInventory(players){
  for(var i=0; i<players.length; i++){
    drawInventoryForPlayer(i, players[i].inventory);
  }
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
  $('#player_' + player + '_inventory').append(itemHtml);
}

function handleRefresh(data){
  this_player = data.dataset.player_red;
  clearMap();
  drawMapEntities(data);
  clearInventory();
  drawInventory(data.players);
  drawPlayers(data.players);
}

function createGame(){
  var secret = $('#secret').val();
  $.get('/api/start/'+secret, function(res){
    if (!res.instance || res.instance.id != secret){
      $.ajax({
        type: 'POST',
        url: '/api/start',
        data: JSON.stringify({id:secret}),
        success: function(res){
          if (!res.instance || res.instance.id != secret){
            console.log(res);
            return;
          }
          handleRefresh(res);
          $('#createGame').hide();
          $('#game').fadeIn();
          return;
        }
      });
      return;
    }
    handleRefresh(res);
    $('#createGame').hide();
    $('#game').fadeIn();
  });
}

function chooseCell(){
  var xy = /\d+_\d+/.exec(this.id);
  action += '_' + xy[0];
  $.ajax({
    type: 'PUT',
    url: '/api/game/'+game_id,
    data: JSON.stringify({action:action}),
    success: function(res){
      console.log(res);
      $('.cell_choosable').removeClass('cell_choosable');
    }
  });
}

$(document).ready(function(){
  drawMapGrid(map_cells_x,map_cells_y);
  $(document).on('click', '#start', createGame)
  $(document).on('click', '#action_move', actionMoveClick);
  $(document).on('click', '#action_drop', actionMoveDrop);
  $(document).on('click', '.cell_choosable', chooseCell);

});
