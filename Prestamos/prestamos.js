document.addEventListener('DOMContentLoaded', function() {
  checkSession();
  var userRoles = window._env_.USER_ROLES;
  verifyRol([userRoles.GESTORES, userRoles.ALUMNOS]);

  var userPrestamosList = document.getElementById('userPrestamosList');
  var estadoPrestamo = window._env_.PRESTAMOS_ESTADOS;
  var userRol = sessionStorage.getItem('rol');

  fetch(`${window._env_.BASE_API_URL}/prestamos/alumnos`, {
    method: 'GET',
    headers: {
      'auth': sessionStorage.getItem('id_token')
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
    var userPrestamosHTML = '';

    data['prestamos'].forEach(function(prestamo) {
      userPrestamosHTML += `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${prestamo.Material_Nombre}</h5>
          <p class="card-text">Email del alumno: ${prestamo.Alumno_Email}</p>
          <p class="card-text">Email del gestor: ${prestamo.Gestor_Email}</p>
          <p class="card-text">Fecha de inicio: ${prestamo.Fecha_Inicio}</p>
          <p class="card-text">Fecha de expiración: ${prestamo.Fecha_Expiracion}</p>
          <p class="card-text">Estado: ${prestamo.Estado}</p>
        </div>
      </div>
      `;
    });

    userPrestamosList.innerHTML = userPrestamosHTML;
  })
  .catch(function(error) {
    alert(error);
    window.location.reload();
  });

  if (userRol === userRoles.GESTORES) {
    var addPrestamoButton = document.getElementById('addPrestamoButton');
    
    addPrestamoButton.style.display = 'inline-block';
    addPrestamoButton.addEventListener('click', function() {
      window.location.href = './PrestamosAdd/addPrestamo.html';
    }
    );

    var prestamosList = document.getElementById('prestamosList');

    fetch(`${window._env_.BASE_API_URL}/prestamos/gestores`, {
      method: 'GET',
      headers: {
        'auth': sessionStorage.getItem('id_token')
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
      var prestamosHTML = '';

      data['prestamos'].forEach(function(prestamo) {
        prestamosHTML += `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${prestamo.Material_Nombre}</h5>
            <p class="card-text">Email del alumno: ${prestamo.Alumno_Email}</p>
            <p class="card-text">Email del Gestor: ${prestamo.Gestor_Email}</p>
            <p class="card-text">Fecha de inicio: ${prestamo.Fecha_Inicio}</p>
            <p class="card-text">Fecha de expiración: ${prestamo.Fecha_Expiracion}</p>
            <p class="card-text">Estado: ${prestamo.Estado}</p>
          </div>
        `;

        console.log(prestamo.Estado === estadoPrestamo.EN_PRESTAMO);

        if (prestamo.Estado === estadoPrestamo.EN_PRESTAMO) {
          prestamosHTML += `
          <button id="finalizarPrestamoButton" class="btn btn-success finalizarPrestamoButton" data-prestamo-id="${prestamo.ID}">Finalizar Pr&eacute;stamo</button>
          `;
        }

        prestamosHTML += `
        </div>
        `;
      });

      prestamosList.innerHTML = prestamosHTML;

      document.querySelectorAll('.finalizarPrestamoButton').forEach(function(button) {
        button.addEventListener('click', function() {
          var prestamotionId = this.getAttribute('data-prestamo-id');
          var formalization = confirm('¿Estás seguro de que quieres finalizar este prestamo?');

          if (formalization) {
            fetch(`${window._env_.BASE_API_URL}/prestamos/gestores/${prestamotionId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'auth': sessionStorage.getItem('id_token')
              }
            })
            .then(function(response) {
              if(response.ok) {
                alert('Prestamo finalizado correctamente');
                window.location.reload();
              } else {
                return response.json().then(function(data) {
                  throw new Error(data.message);
                });
              }
            })
            .catch(function(error) {
              alert(error);
              window.location.reload();
            });
          }
        });
      });
    })
    .catch(function(error) {
      alert(error);
    });
  }
});