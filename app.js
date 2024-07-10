document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('profileButton').addEventListener('click', () => {
    window.location.href = './Usuarios/UsuarioDetalles/userDetails.html';
  });

  document.getElementById('logoutButton').addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = '/Authentication/Login/login.html';
  });
});

function checkSession() {
  var token = sessionStorage.getItem('id_token');
  if(!token) {
    window.location.href = './Authentication/Login/login.html';
  }
}

function verifyRol(roles) {
  var userRol = sessionStorage.getItem('rol');
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