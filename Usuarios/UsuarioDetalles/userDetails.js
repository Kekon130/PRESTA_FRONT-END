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
      userName: payloadObj['sub'] || undefined,
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

  if (userAttributes.rol !== window._env_.USER_ROLES.ADMINISTRADORES) {
    document.getElementById('deleteButton').style.display = 'inline-block';
    document.getElementById('deleteButton').addEventListener('click', function() {
      fetch(`${window._env_.BASE_API_URL}/usuario/alumnos/${userAttributes.userName}`, {
        method: 'DELETE',
        headers: {
          auth: getCookie('id_token')
        }
      })
      .then(function(response) {
        if (response.ok) {
          alert('Usuario eliminado');
          window.location.href = '../../Authentication/login.html';
        } else {
          return response.json().then(function(error) {
            throw new Error(error.message);
          });
        }
      })
      .catch(function(error) {
        alert(error.message);
      });
    });
  }
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