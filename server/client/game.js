var game_id = null;
var this_player = null;
var map_cells_h = 10;
var map_cells_v = 6;
var action;
var lastInstanceTurn = -1;
var dataset = {};

var interactsWith = [];
interactsWith[7] = 8; // Key with door
interactsWith[11] = 10; // Bucket with water
interactsWith[12] = 9; //extinguisher with fire
var audioMuted = store('audio')||false;
var audio = {
  splash: new Audio("audio/splash.wav"),
  drop: new Audio("audio/drop.wav"),
  backpack: new Audio("audio/backpack.wav"),
  walkingSound: new Audio("audio/footstepsDirt.wav"),
  backgroundMusic: new Audio("audio/music.mp3")
}

$.ajaxSetup({
   contentType: "application/json",
   dataType: "json"
});

function showMessage(text, type) {
  if ('undefined' === typeof type) type = 'error';
  $('#message').removeClass('info success warn error').addClass(type).text(text);
}

function hideMessage() {
  $('#message').removeClass('info success warn error').empty();
}

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
  if(lastInstanceTurn >=0){
    if (!audioMuted) audio.walkingSound.play();
  }
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
function clearChoosableOnNeighboringCells(h, v){
  $('#map_cell_' + (h-1) + "_" + v + ',' +
    '#map_cell_' + (h+1) + "_" + v + ',' +
    '#map_cell_' + h + "_" + (v-1) + ',' +
    '#map_cell_' + h + "_" + (v+1)).removeClass('cell_choosable');
}

function getNeighboringInteractableCells(h, v, inventory){
  var neighboringObjects =  $('#map_cell_' + (h-1) + "_" + v + ' ,' +
    '#map_cell_' + (h+1) + "_" + v + ' ,' +
    '#map_cell_' + h + "_" + (v-1) + ' ,' +
    '#map_cell_' + h + "_" + (v+1) + ' ')

  if(inventory != 0){
    return neighboringObjects.filter(':has( > img[src="objects/' + interactsWith[inventory] + '.png"])');
  }
  else {
    var selectors = [];
    selectors.push(':has(> img[src="objects/5.png"])');
    for (var iter=0,len=dataset.collectables.length;iter<len;iter++) {
      selectors.push(':has(> img[src="objects/'+dataset.collectables[iter]+'.png"])');
    }
    //console.log('selectors',selectors);
    return neighboringObjects.filter(selectors.join(' , '));
  }
}


function actionInteractClick(){
  clearChoosableOnNeighboringCells(this_player.h, this_player.v);
  getNeighboringInteractableCells(this_player.h, this_player.v, this_player.inventory).addClass('cell_choosable');
  action = 'interact';
}

function actionMoveClick(){
  clearChoosableOnNeighboringCells(this_player.h, this_player.v);
  getNeighboringEmptyCells(this_player.h, this_player.v).addClass('cell_choosable');
  action = 'move';
}

function actionDropClick(){
  clearChoosableOnNeighboringCells(this_player.h, this_player.v);
  getNeighboringEmptyCells(this_player.h, this_player.v).addClass('cell_choosable');
  action = 'drop';
}

function actionSkipClick(){
  action = 'skip';
  submitAction();
}

function drawInventoryForPlayer(player, item){
  if(item != 0){
    var itemHtml = '<img src="objects/' + item + '.png" class="inventory_object"/>';
    $('#player_' + player + '_inventory').append(itemHtml);
    if (player === this_player.id)
      $('#action_drop').attr('disabled', false);
  } else {
    if (player === this_player.id)
      $('#action_drop').attr('disabled', 'disabled');
  }
}

function handleRefresh(data){
  // Yeah, just go with it.
  var player_id = this_player.id;
  this_player = data.players[this_player.id];
  this_player.id = player_id;

  dataset = data.dataset;
  clearMap();
  drawMapEntities(data);
  clearInventory();
  drawInventory(data.players);
  drawPlayers(data.players);

  enableDisableInteractAction(data);
}

function enableDisableInteractAction(data){
  if (lastInstanceTurn != -1 && getNeighboringInteractableCells(data.players[this_player.id].h, data.players[this_player.id].v, data.players[this_player.id].inventory).size() > 0){
    $('#action_interact').attr('disabled',false);
  }
  else{
    $('#action_interact').attr('disabled','disabled');
  }
}

function createGame(){
  game_id = $('#secret').val();
  $.get('/api/start/'+game_id, function(res){
    if (!res.result && res.error) {
      showMessage(res.error);
      return;
    }
    if (!res.instance || res.instance.id != game_id){
      $.ajax({
        type: 'POST',
        url: '/api/start',
        data: JSON.stringify({id:game_id}),
        success: function(res){
          initializeOnce(res);
          if (!res.instance || res.instance.id != game_id){
            console.log(res);
            return;
          }
          handleRefresh(res);
          showMessage('New game started - waiting for team to join','success');
          bindUnload();
          setTimeout(function(){
            $('.player_icon').fadeOut('slow');
          },1000);
          return;
        }
      });
      return;
    }
    initializeOnce(res);
    handleRefresh(res);
    $('.player_icon').hide();
    showMessage('Welcome player '+(++res.profile) + ' - waiting for team to join','info');
    bindUnload();
  });
}

function submitAction(){
    $.ajax({
    type: 'PUT',
    url: '/api/game/'+game_id,
    data: JSON.stringify({action:action, player_id: this_player.id}),
    success: function(res){
      $('.cell_choosable').removeClass('cell_choosable');
      showMessage('your action: '+action,'info');
      if (!audioMuted) playSound(action);
    }
  });
}

function playSound(action){
  var actionParsed = /([^_1-9]+)_?(\d+)?_?(\d+)?/.exec(action);
  if ('drop' == actionParsed[1]) {
    audio.drop.play();
  } else if('interact' == actionParsed[1]) {
    if($('#map_cell_'+actionParsed[2]+'_'+actionParsed[3]).find('[src*="'+dataset.full_chest+'.png"]').length === 1){
      audio.backpack.play();
    }
    if($('#map_cell_'+actionParsed[2]+'_'+actionParsed[3]).find('[src*="'+dataset.water+'.png"]').length === 1){
      audio.splash.play();
    }
  }
}

function initializeOnce(data){
  game_id = data.instance.id;
  this_player = data.players[data.profile];
  this_player.id = data.profile;
  pollForNewTurns();
  $('#createGame').hide();
  $('#game').fadeIn();
  $('#action_move').attr('disabled', 'disabled');
  $('#action_skip').attr('disabled', 'disabled');
  $('#action_drop').attr('disabled', 'disabled');
  $('#action_interact').attr('disabled', 'disabled');
}

function chooseCell(){
  var hv = /\d+_\d+/.exec(this.id);
  action += '_' + hv[0];
  submitAction();
}

function reloadGameCreate(res) {
  showMessage(res.error);
  $('#createGame').fadeIn();
  $('#game').fadeOut();
  $('#secret').val(game_id);
  $('#action_move').attr('disabled', 'disabled');
  $('#action_skip').attr('disabled', 'disabled');
  $('#action_drop').attr('disabled', 'disabled');
  $('#action_interact').attr('disabled', 'disabled');

  game_id = null;
  this_player = null;
  action;
  lastInstanceTurn = -1;
  clearTimeout(window.pollTurnPointer);
}

function pollForNewTurns(){
  $.ajax({
    type: 'GET',
    url: '/api/game/'+game_id,
    success: function(res) {
      if (!res.result && res.error) {
        reloadGameCreate(res);
        return;
      }
      if (lastInstanceTurn === -1 && res.profile !== 3) return;
      if (lastInstanceTurn === -1 && res.profile >= 3) {
        $('.player_icon').fadeIn('slow');
        $('#action_move').attr('disabled', false);
        $('#action_skip').attr('disabled', false);
        if ($('#player_'+this_player.id+'_inventory').has('.inventory_object').length === 1)
          $('#action_drop').attr('disabled',false);
        showMessage('Started', 'info');
        lastInstanceTurn = 0;
        enableDisableInteractAction(res);
      }
      if(res.instance && res.instance.turn > lastInstanceTurn) {
        lastInstanceTurn = res.instance.turn;
        handleRefresh(res);
        hideMessage();
      } else if (Object.keys(res.pendingActions).length < 4) {
        var actionsLeft = 4 - Object.keys(res.pendingActions).length;
        showMessage('Started - ' + actionsLeft + ' players deciding', 'info');
      }

    },
    complete: function(){
      if (game_id !== null)
        window.pollTurnPointer = window.setTimeout(pollForNewTurns, 1000);
    }
  });
}

$(document).ready(function(){
  drawMapGrid(map_cells_h,map_cells_v);
  $(document).on('click', '#start', createGame);
  $(document).on('click', '#action_move', actionMoveClick);
  $(document).on('click', '#action_drop', actionDropClick);
  $(document).on('click', '#action_skip', actionSkipClick);
  $(document).on('click', '#action_interact', actionInteractClick);
  $(document).on('click', '.cell_choosable', chooseCell);

  $('#audio').click(toggleAudio).removeClass('on mute').addClass(audioMuted?'mute':'on');
  if (!audioMuted) {
    audio.backgroundMusic.addEventListener('ended', function() {
      this.currentTime = 0;
      if (!audioMuted) this.play();
    }, false);
    audio.backgroundMusic.play();
  }
});

function bindUnload() {
  $(window).bind('beforeunload', function(){
    if(/Firefox[\/\s](\d+)/.test(navigator.userAgent) && new Number(RegExp.$1) >= 4) {
       var data={async:false};
       leaveGame(data);
      return;//'Do you really want to abandon the game?';
    } else {
      var data={async:true};
      leaveGame(data);
      return;//'Do you really want to abandon the game?';
    }
  });
}

function leaveGame(data) {
  clearTimeout(window.pollTurnPointer);
  $.ajax({
    type: 'PUT',
    url: '/api/leave/'+game_id,
    data: JSON.stringify({profile:this_player}),
    success: function(res){
      console.log(res);
    }
  });
}

function toggleAudio() {
  audioMuted = !audioMuted;
  store('audio', audioMuted);
  $('#audio').removeClass('on mute').addClass(audioMuted?'mute':'on');
  if (audioMuted) {
    audio.backgroundMusic.pause();
    audio.walkingSound.pause();
  } else {
    audio.backgroundMusic.addEventListener('ended', function() {
      this.currentTime = 0;
      if (!audioMuted) this.play();
    }, false);
    audio.backgroundMusic.play();
  }
}

function setCookieNoExp(name, value)
{
  var cookieExp = new Date();     //set 8/06/2012 date object
  cookieExp.setTime(cookieExp.getTime() + (1000 * 60 * 60 * 24 * 365 * 5));  //5 years
  document.cookie = name + "=" + escape(value) + "; path=/; expires=" + cookieExp.toGMTString();
}
function getCookie(cookieName)
{
  var theCookie=""+document.cookie;
  var ind=theCookie.indexOf(cookieName+"=");
  if (ind==-1 || cookieName=="") return "";
  var ind1=theCookie.indexOf(";",ind);
  if (ind1==-1) ind1=theCookie.length;
  return unescape(theCookie.substring(ind+cookieName.length+1,ind1));
}
function isJSON(test){
  if ("string" !== typeof test) return false;
  return /^[\],:{}\s]*$/.test(test.replace(/\\["\\\/bfnrtu]/g, '@').
    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
    replace(/(?:^|:|,)(?:\s*\[)+/g, ''));
}
function store(key,item) {
  var text;
  if ((function(){var mod='testHasLocalStorage';try{window.localStorage.setItem(mod,mod);window.localStorage.removeItem(mod);return true;}catch(e){return false;}})() === true){
    if ("undefined" === typeof item) {
      text = window.localStorage.getItem(key);
      return (isJSON(text) ? JSON.parse(text) : text);
    } else {
      return window.localStorage.setItem(key,isJSON(item) ? JSON.stringify(item) : item);
    }
  } else {
    if ("undefined" === typeof item) {
      text = getCookie(key);
      return (isJSON(text) ? JSON.parse(text) : text);
    } else {
      return setCookieNoExp(key,isJSON(item) ? JSON.stringify(item) : item);
    }
  }
}
