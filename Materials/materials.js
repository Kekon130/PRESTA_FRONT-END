document.addEventListener('DOMContentLoaded', function() {
  checkSession();
  var userRoles = window._env_.USER_ROLES;
  verifyRol([userRoles.GESTORES, userRoles.ALUMNOS]);

  var userRol = getUserRol();

  if (userRol === userRoles.GESTORES) {
    document.getElementById('addMaterialButton').style.display = 'inline-block';
    document.getElementById('addMaterialButton').addEventListener('click', function() {
      window.location.href = './MaterialsAdd/addMaterial.html';
    });
  }

  var materialsList = document.getElementById('materialsList');

  fetch(`${window._env_.BASE_API_URL}/material`, {
    method: 'GET',
    headers: {
      'auth': getCookie('id_token')
    }
  })
  .then(function(response) {
    if(response.ok) {
      return response.json();
    } else {
      throw new Error('An error occurred');
    }
  })
  .then(function(data) {
    var materialsHTML = '';

    Object.keys(data).forEach(function(key) {
      var materialsType = key.charAt(0).toUpperCase() + key.slice(1);
      materialsHTML += `<h3>${materialsType}</h3>`;

      data[key].forEach(function(material) {
        materialsHTML += `
        <a href="./MaterialDetails/materialDetails.html?id=${encodeURIComponent(material.ID)}&type=${encodeURIComponent(materialsType)}" class="mb-3 text-decoration-none text-dark">
          <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${material.Nombre}</h5>
                <p class="card-text">Disponibles: ${material.Unidades_Disponibles}</p>
                ${material.ISBN ? `<p class="card-text">ISBN: ${material.ISBN}</p>` : ''}
                ${material.Autor ? `<p class="card-text">Autor: ${material.Autor}</p>` : ''}
                ${material.Modelo ? `<p class="card-text">Modelo: ${material.Modelo}</p>` : ''}
                <p class="card-text">Asignatura: ${material.Asignatura}</p>
            </div>
          </div>
        </a>`;
      });
    });
    materialsList.innerHTML = materialsHTML;
  })
  .catch(function(error) {
    console.log(error);
    materialsList.innerHTML = `<p>Error al cargar los materiales: ${error.message}.</p>`;
  });
});