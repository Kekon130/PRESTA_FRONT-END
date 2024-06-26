document.addEventListener('DOMContentLoaded', function() {
  function checkSession() {
    var token = getCookie('id_token');
    if(!token) {
      window.location.href = "../../Authentication/login.html";
    }
  }

  function getUserAttributes() {
    var token = getCookie('id_token');    
    var payload = token.split('.')[1];
    var decodedPayload = atob(payload);
    var payloadObj = JSON.parse(decodedPayload);
    return {
      name: payloadObj['name'] || undefined,
      userName: payloadObj['sub'] || undefined
    }
  }

  checkSession();

  var userName = getUserName();
  var userEditFormContainer = document.getElementById('userEditFormContainer');
  var userEditForm = `
    <form id="userEditForm">
      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input type="text" class="form-control" id="nombre" value="${userName}" required>
      </div>
      <div class="form-group">
        <label for="password">Nueva Contraseña</label>
        <input type="password" class="form-control" id="password">
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirmar Nueva Contraseña</label>
        <input type="password" class="form-control" id="confirmPassword">
      </div>
      <button type="submit" class="btn btn-primary">Actualizar</button>
    </form>
  `;

  userEditFormContainer.innerHTML = userEditForm;

  document.getElementById('userEditForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var name = document.getElementById('nombre').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var userAttributes = {
      name: name
    };

    if(password && password === confirmPassword) {
      userAttributes.password = password;
    } else if(password) {
      alert('Las contraseñas no coinciden');
      return;
    }

    console.log(userAttributes);

    fetch(`${window._env_.API_URL}/users/${userName}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        auth: getCookie('id_token')
      },
      body: JSON.stringify(userAttributes)
    })
    .then(response => {
      if(response.ok) {
        alert('Usuario actualizado');
        window.location.href = '../UsuarioDetalles/userDetails.html';
      } else {
        return response.json().then(error => {
          throw new Error(error.message);
        });
      }
    })
    .catch(error => {
      alert(error.message);
    });
  });
});