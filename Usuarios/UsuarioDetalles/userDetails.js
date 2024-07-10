document.addEventListener('DOMContentLoaded', function() {
  checkSession();
  
  var userInfo = document.getElementById('userInfo');
  userInfo.innerHTML = `
    <h3>Usuario</h3>
    <p><strong>Nombre:</strong> ${sessionStorage.getItem('name')}</p>
    <p><strong>Email:</strong> ${sessionStorage.getItem('email')}</p>
    <p><strong>Rol:</strong> ${sessionStorage.getItem('rol')}</p>
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
          auth: sessionStorage.getItem('id_token')
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