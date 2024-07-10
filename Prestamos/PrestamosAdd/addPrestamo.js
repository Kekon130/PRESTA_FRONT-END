document.addEventListener('DOMContentLoaded', function() {
  checkSession();
  var userRoles = window._env_.USER_ROLES;
  verifyRol([userRoles.GESTORES]);

  document.getElementById('addPrestamoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var alumnoEmail = document.getElementById('alumnoEmail').value;
    var materialNombre = document.getElementById('materialNombre').value;
    var tipoMaterial = document.getElementById('tipoMaterial').value;

    var prestamo = {
      Alumno_Email: alumnoEmail,
      Material_Nombre: materialNombre,
      Material_Type: tipoMaterial
    };

    console.log(prestamo);

    fetch(`${window._env_.BASE_API_URL}/prestamos/gestores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth': sessionStorage.getItem('id_token')
      },
      body: JSON.stringify(prestamo)
    })
    .then(response => {
      console.log(response);
      if (response.ok) {
        alert('Prestamo añadido correctamente');
        window.location.reload();
      } else {
        return response.json().then(error => {
          throw new Error(error.message);
        });
      }
    })
    .catch(error => {
      alert(`Error al añadir prestamo: ${error.message}`);
    });
  });
});