document.addEventListener('DOMContentLoaded', function() {
  var userRoles = window._env_.USER_ROLES;

  checkSession();
  veryfyRol([userRoles.GESTORES]);

  var materialData = localStorage.getItem('materialData');
  if (!materialData) {
    alert('No se ha encontrado información del material');
    window.location.href = '../materials.html';
  }

  var material = JSON.parse(materialData);
  var params = getQueryParams();
  var materialID = params.id;
  var materialType = params.type;
  var editMaterialFormContainer = document.getElementById('editMaterialFormContainer');

  var htmlForm = `
    <form id="editMaterialForm">
      <div class="form-group>
        <label for="nombre">Nombre</label>
        <input type="text" class="form-control" id="nombre" value="${material.Nombre}" required>
      </div>
      <div class="form-group">
        <label for="cantidad">Cantidad</label>
        <input type="number" class="form-control" id="cantidad" value="${material.Cantidad}" required>
      </div>
      ${material.ISBN ? `
      <div class="form-group">
          <label for="isbn">ISBN</label>
          <input type="text" class="form-control" id="isbn" value="${material.ISBN}">
      </div>` : ''}
      ${material.Año_de_Publicacion ? `
      <div class="form-group">
          <label for="añoDePublicacion">Año de Publicación</label>
          <input type="text" class="form-control" id="añoDePublicacion" value="${material.Año_de_Publicacion}">
      </div>` : ''}
      ${material.Asignatura ? `
      <div class="form-group">
          <label for="asignatura">Asignatura</label>
          <input type="text" class="form-control" id="asignatura" value="${material.Asignatura}">
      </div>` : ''}
      ${material.Autor ? `
      <div class="form-group">
          <label for="autor">Autor</label>
          <input type="text" class="form-control" id="autor" value="${material.Autor}">
      </div>` : ''}
      ${material.Modelo ? `
      <div class="form-group">
          <label for="modelo">Modelo</label>
          <input type="text" class="form-control" id="modelo" value="${material.Modelo}">
      </div>` : ''}
      <button type="submit" class="btn btn-primary">Guardar Cambios</button>
    </form>`;

  editMaterialFormContainer.innerHTML = htmlForm;

  document.getElementById('editMaterialForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var materialData = {
      Nombre: document.getElementById('nombre').value,
      Cantidad: document.getElementById('cantidad').value,
      ISBN: material.ISBN ? document.getElementById('isbn').value : undefined,
      Año_de_Publicacion: material.Año_de_Publicacion ? document.getElementById('añoDePublicacion').value : undefined,
      Asignatura: material.Asignatura ? document.getElementById('asignatura').value : undefined,
      Autor: material.Autor ? document.getElementById('autor').value : undefined,
      Modelo: material.Modelo ? document.getElementById('modelo').value : undefined
    };

    fetch(`${window._env_.BASE_API_URL}/material/${materialType}/${materialID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        auth: getCookie('id_token')
      },
      body: JSON.stringify(materialData)
    })
    .then(function(response) {
      if (response.ok) {
        alert('Material actualizado correctamente');
        window.location.href = `../MaterialDetails/materialDetails.html?type=${encodeURIComponent(materialType)}&id=${encodeURIComponent(materialID)}`;
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
});