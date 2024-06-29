document.addEventListener('DOMContentLoaded', function() {
  checkSession();
  var userRoles = window._env_.USER_ROLES;
  verifyRol([userRoles.ADMINISTRADORES]);

  var userList = document.getElementById('userList');

  fetch(`${window._env_.BASE_API_URL}/users/administradores`, {
    method: 'GET',
    headers: {
      'auth': getCookie('id_token')
    }
  })
  .then(function(response) {
    if(response.ok) {
      return response.json();
    } else {
      return response.json().then(function(data) {
        throw new Error(data.message);
      });
    }
  })
  .then(function(data) {
    var usersHTML = '';

    console.log(data)

    data['users'].forEach(function(user) {
      console.log(user)
      usersHTML += `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${user.name}</h5>
          <p class="card-text">Correo: ${user.email}</p>
          <p class="card-text">Rol: ${user.rol}</p>
        </div>
        <button id="changeRolButton" class="btn btn-warning changeRolButton" data-user-id="${user.username}" data-user-rol="${user.rol}">Cambiar Rol</button>
      </div>
      `;
    });
    
    userList.innerHTML = usersHTML;

    document.querySelectorAll('.changeRolButton').forEach(function(button) {
      button.addEventListener('click', function() {
        var userId = this.getAttribute('data-user-id');
        var userRol = this.getAttribute('data-user-rol');
        var newRol = userRol === userRoles.GESTORES ? userRoles.ALUMNOS : userRoles.GESTORES;
        

        fetch(`${window._env_.BASE_API_URL}/users/administradores/${userId}`, {
          method: 'PATCH',
          headers: {
            'auth': getCookie('id_token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            old_group: userRol,
            new_group: newRol
          })
        })
        .then(function(response) {
          if(response.ok) {
            alert('Rol cambiado correctamente');
            window.location.reload();
          } else {
            return response.json().then(function(data) {
              throw new Error(data.message);
            });
          }
        })
        .catch(function(error) {
          alert(error.message);
        });
      });
    });
  })
  .catch(function(error) {
    alert(error.message);
  });
});