document.addEventListener('DOMContentLoaded', () => {
  var token = getCookie('id_token');

  if (token) {
    document.getElementById('authButtons').style.display = 'none';
    document.getElementById('userLink').style.display = 'block';
  } else {
    document.getElementById('authButtons').style.display = 'block';
    document.getElementById('userLink').style.display = 'none';
  }
  
  var userRol = getUserRol();
  var navigationBar = document.getElementById('navigationBar');

  if (userRol.includes(window._env_.USER_ROLES.ADMINISTRADORES)) {
    navigationBar.innerHTML = `
    <ul class="nav">
      <li class="nav-item">
        <a
          href="./Usuarios/usuarios.html"
          id="usuariosLink"
          class="nav-link text-white display-4"
          >Usuarios</a
        >
      </li>
    </ul>
    `;
  } else {
    navigationBar.innerHTML = `
    <ul class="nav">
      <li class="nav-item">
        <a
          href="./Materials/materials.html"
          id="materialsLink"
          class="nav-link text-white display-4"
          >Materiales</a
        >
      </li>
      <li class="nav-item">
        <a href="./Prestamos/prestamos.html" id="loansLink" class="nav-link text-white display-4"
          >Prestamos</a
        >
      </li>
      <li class="nav-item">
        <a
          href="./Reservas/reservas.html"
          id="reservationsLink"
          class="nav-link text-white display-4"
          >Reservas</a
        >
      </li>
    </ul>
    `;
  }
});