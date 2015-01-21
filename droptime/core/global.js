function info(txt){
  !console.info || console.info(txt);
}
function log(txt){
  !console.log || console.log(txt);
}
function debug(txt){
  !console.debug || console.debug(txt);
}
function warn(txt){
  !console.warn || console.warn(txt);
}
function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function UUIDv3(){
  var crypto_uuid = function crypto_uuid(){
    var getRandomValues = crypto.getRandomValues.bind(crypto);
    var buffer = new Uint16Array(8 * 24); // space for 24 uuids
    var index = 0;
    var guid = [], n, i = 0;
    if(index == 0) getRandomValues(buffer);
    for(; i < 8; i++){
      n = buffer[index + i];
      if(i == 3) n = (n & 0x0FFF) + 0x4000;
      if(i == 4) n = (n & 0x3FFF) + 0x8000;
      if(i >= 2 && i < 6) guid.push("-");
      guid.push((n + 0x10000).toString(16).substr(1));
    }
    index += 8;
    if(index >= buffer.length) index = 0;
    return guid.join("");
  };

  var regex_uuid = function regex_uuid(){
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,
      function(c){
        var r, v;
        r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
  };

  return (typeof crypto === 'object') ? crypto_uuid() : regex_uuid();
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
function store(key,item) {
  var text;
  if ((function(){var mod='testHasLocalStorage';try{window.localStorage.setItem(mod,mod);window.localStorage.removeItem(mod);return true;}catch(e){return false;}})() === true){
    if ("undefined" === typeof item && item !== null) {
      text = window.localStorage.getItem(key);
      return (text !== null && /^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, '')) ? JSON.parse(text) : text);
    } else {
      return window.localStorage.setItem(key,(/^[\],:{}\s]*$/.test(item.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) ? JSON.stringify(item) : item);
    }
  } else {
    if ("undefined" === typeof item && item !== null) {
      text = getCookie(key);
      return (text !== null && /^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, '')) ? JSON.parse(text) : text);
    } else {
      return setCookieNoExp(key,(/^[\],:{}\s]*$/.test(item.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) ? JSON.stringify(item) : item);
    }
  }
}