document.addEventListener('DOMContentLoaded', function() {
  function checkSession() {
    var token = getCookie('id_token');
    if(!token) {
      window.location.href = '../Authentication/login.html';
    }
  }

  function getUserAttributes() {
    var token = getCookie('id_token');    
    var payload = token.split('.')[1];
    var decodedPayload = atob(payload);
    var payloadObj = JSON.parse(decodedPayload);
    return {
      email: payloadObj['email'] || undefined,
      name: payloadObj['name'] || undefined,
      rol: payloadObj['cognito:groups'][0] || undefined
    }
  }

  checkSession();
  
  var userAttributes = getUserAttributes();
  var userInfo = document.getElementById('userInfo');
  userInfo.innerHTML = `
    <h3>Usuario</h3>
    <p><strong>Nombre:</strong> ${userAttributes.name}</p>
    <p><strong>Email:</strong> ${userAttributes.email}</p>
    <p><strong>Rol:</strong> ${userAttributes.rol}</p>
  `;

  document.getElementById('editButton').addEventListener('click', function() {
    window.location.href = '../UsuarioEditar/userEdit.html';
  });

  document.getElementById('deleteUserButton').addEventListener('click', function() {
    return
  });
});

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