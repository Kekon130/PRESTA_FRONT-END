document.addEventListener('DOMContentLoaded', function() {
  checkSession();
  var userRoles = window._env_.USER_ROLES;
  verifyRol([userRoles.GESTORES, userRoles.ALUMNOS]);

  var userReservationsList = document.getElementById('userReservationsList');
  var estadoReserva = window._env_.RESERVA_ESTADOS;

  fetch(`${window._env_.BASE_API_URL}/reservas/alumnos`, {
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
    var userReservationsHTML = '';

    console.log(data)

    data['reservas'].forEach(function(reserva) {
      console.log(reserva)
      userReservationsHTML += `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${reserva.Material_Nombre}</h5>
          <p class="card-text">Fecha de inicio: ${reserva.Fecha_Inicio}</p>
          <p class="card-text">Fecha de expiración: ${reserva.Fecha_Expiracion}</p>
          <p class="card-text">Estado: ${reserva.Estado}</p>
        </div>
      `;

      if (reserva.Estado === estadoReserva.PENDIENTE_RECOGIDA) {
        userReservationsHTML += `
        <button id="cancelReservationButton" class="btn btn-danger cancelReservationButton" data-reservation-id="${reserva.ID}">Cancelar reserva</button>
        `;
      }

      userReservationsHTML += `
      </div>
      `;
    });

    userReservationsList.innerHTML = userReservationsHTML;

    document.querySelectorAll('.cancelReservationButton').forEach(function(button) {
      button.addEventListener('click', function() {
        var reservationId = this.getAttribute('data-reservation-id');
        var cancelation = confirm('¿Estás seguro de que quieres cancelar esta reserva?');

        if (cancelation) {
          fetch(`${window._env_.BASE_API_URL}/reservas/alumnos/${reservationId}`, {
            method: 'PATCH',
            headers: {
              'auth': sessionStorage.getItem('id_token')
            }
          })
          .then(function(response) {
            if(response.ok) {
              alert('Reserva cancelada correctamente');
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
    window.location.reload();
  });

  var userRol = sessionStorage.getItem('rol');

  if (userRol === userRoles.GESTORES) {
    var reservationsList = document.getElementById('reservationsList');

    fetch(`${window._env_.BASE_API_URL}/reservas/gestores`, {
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
      var reservationsHTML = '';

      console.log(data)

      data['reservas'].forEach(function(reserva) {
        console.log(reserva)
        reservationsHTML += `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${reserva.Material_Nombre}</h5>
            <p class="card-text">Email del alumno: ${reserva.Alumno_Email}</p>
            <p class="card-text">Fecha de inicio: ${reserva.Fecha_Inicio}</p>
            <p class="card-text">Fecha de expiración: ${reserva.Fecha_Expiracion}</p>
            <p class="card-text">Estado: ${reserva.Estado}</p>
          </div>
        `;

        if (reserva.Estado === estadoReserva.PENDIENTE_RECOGIDA) {
          reservationsHTML += `
          <button id="formalizeReservationButton" class="btn btn-success formalizeReservationButton" data-reservation-id="${reserva.ID}">Formalizar reserva</button>
          `;
        }

        reservationsHTML += `
        </div>
        `;
      });

      reservationsList.innerHTML = reservationsHTML;

      document.querySelectorAll('.formalizeReservationButton').forEach(function(button) {
        button.addEventListener('click', function() {
          var reservationId = this.getAttribute('data-reservation-id');
          var formalization = confirm('¿Estás seguro de que quieres formalizar esta reserva?');

          if (formalization) {
            fetch(`${window._env_.BASE_API_URL}/reservas/gestores/${reservationId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'auth': sessionStorage.getItem('id_token')
              }
            })
            .then(function(response) {
              if(response.ok) {
                alert('Reserva formalizada correctamente');
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
      window.location.reload();
    });
  }
});