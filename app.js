function getCookie(name) {
  var cookieArr = document.cookie.split(';');

  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split('=');
    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
}

function checkSession() {
  var token = getCookie('id_token');
  if(!token) {
    window.location.href = './Authentication/login.html';
  }
}

function getUserRol() {
  var token = getCookie('id_token');    
  var payload = token.split('.')[1];
  var decodedPayload = atob(payload);
  var payloadObj = JSON.parse(decodedPayload);
  return payloadObj['cognito:groups'][0] || [];
}

function veryfyRol(roles) {
  var userRol = getUserRol();
  if (!roles.includes(userRol)){
    alert('No tienes permisos para acceder a esta página');
    window.location.href = './index.html';
  }
}

function getQueryParams() {
  var queryParams = {};
  var search = window.location.search.substring(1);
  var query = search.split('&');
  for (var i = 0; i < query.length; i++) {
    var pair = query[i].split('=');
    queryParams[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return queryParams;
}