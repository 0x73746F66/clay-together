var game_id = 'uuid';
$.ajaxSetup({
   contentType: "application/json",
   dataType: "json"
});

var map_cells_h = 10;
var map_cells_v = 6;

var this_player = null;

var action;

function drawMapGrid(width, height){
  var mapHtml = "";
  for(var v=0; v<height; v++){
    mapHtml += '<div class="map_row">';
    for(var h=0; h<width; h++){
      mapHtml += '<span class="map_cell" id="map_cell_' + h + "_" + v + '"/>';
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
  for(var v=0; v<map_cells_v; v++){
    for(var h=0; h<map_cells_h; h++){
      if(response.map[v][h] != response.dataset.empty){
        $("#map_cell_" + h + "_" + v).append('<img src="objects/' + response.map[v][h] + '.png" class="map_object"/>');
      }
    }
  }
}

function drawPlayers(players){
  for(var i=0; i<players.length; i++){
    $("#map_cell_" + players[i].h + "_" + players[i].v).append('<img src="objects/' + players[i].sprite + '.png" class="map_object player_icon"/>');
  }
}

function drawInventory(players){
  for(var i=0; i<players.length; i++){
    drawInventoryForPlayer(i, players[i].inventory);
  }
}

function getNeighboringEmptyCells(h, v){
  return $('#map_cell_' + (h-1) + "_" + v + ':empty,' +
    '#map_cell_' + (h+1) + "_" + v + ':empty,' +
    '#map_cell_' + h + "_" + (v-1) + ':empty,' +
    '#map_cell_' + h + "_" + (v+1) + ':empty');
}

function actionMoveClick(){
  getNeighboringEmptyCells(this_player.h, this_player.v).addClass('cell_choosable');
  action = 'move';
}

function actionMoveDrop(){
  getNeighboringEmptyCells(this_player.h, this_player.v).addClass('cell_choosable');
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
  this_player = data.players[data.profile];
  clearMap();
  drawMapEntities(data);
  clearInventory();
  drawInventory(data.players);
  drawPlayers(data.players);
}

function createGame(){
  var secret = $('#secret').val();
  $.get('/api/start/'+secret, function(res){
    if (res.result) {
      $('body').prepend("<h1>"+res.error+"</h1>");
      return;
    }
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
  var hv = /\d+_\d+/.exec(this.id);
  action += '_' + hv[0];
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
  drawMapGrid(map_cells_h,map_cells_v);
  $(document).on('click', '#start', createGame);
  $(document).on('click', '#action_move', actionMoveClick);
  $(document).on('click', '#action_drop', actionMoveDrop);
  $(document).on('click', '.cell_choosable', chooseCell);
});
