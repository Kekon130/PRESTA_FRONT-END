document.addEventListener('DOMContentLoaded', function() {
  function updateAdditionalFields(materialType) {
    var additionalFields = document.getElementById('additionalFields');
    additionalFields.innerHTML = '';
    var materialTypes = window._env_.MATERIAL_TYPES;

    switch(materialType) {
      case materialTypes.LIBROS:
        additionalFields.innerHTML = `
        <div class="form-group>
          <label for="ISBNMaterial">ISBN</label>
          <input type="text" class="form-control" id="ISBNMaterial" name="ISBNMaterial" required>
        </div>
        <div class="form-group>
          <label for="Año_de_PublicaciónMaterial">Año de Publicación</label>
          <input type="text" class="form-control" id="Año_de_PublicaciónMaterial" name="Año_de_PublicaciónMaterial" required>
        </div>
        <div class="form-group>
          <label for="AsignaturaMaterial">Asignatura</label>
          <input type="text" class="form-control" id="AsignaturaMaterial" name="AsignaturaMaterial" required>
        </div>`;
        break;
      case materialTypes.CALCULADORAS:
        additionalFields.innerHTML = `
        <div class="form-group>
          <label for="ModeloMaterial">Modelo</label>
          <input type="text" class="form-control" id="ModeloMaterial" name="ModeloMaterial" required>
        </div>`;
        break;
      case materialTypes.APUNTES:
        additionalFields.innerHTML = `
        <div class="form-group>
          <label for="AutorMaterial">Autor</label>
          <input type="text" class="form-control" id="AutorMaterial" name="AutorMaterial" required>
        </div>
        <div class="form-group>
          <label for="AsignaturaMaterial">Asignatura</label>
          <input type="text" class="form-control" id="AsignaturaMaterial" name="AsignaturaMaterial" required>
        </div>`;
        break;
    }
  }

  checkSession();
  var userRoles = window._env_.USER_ROLES;
  verifyRol([userRoles.GESTORES]);

  var initialMaterialType = document.getElementById('TipoMaterial').value;
  updateAdditionalFields(initialMaterialType);

  document.getElementById('addMaterialForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var tipoMaterial = document.getElementById('TipoMaterial').value;
    var nombreMaterial = document.getElementById('NombreMaterial').value;
    var cantidadMaterial = document.getElementById('CantidadMaterial').value;
    var additionalFields = document.getElementById('additionalFields').children;

    var additionalData = {};
    for (var i = 0; i < additionalFields.length; i++) {
      var input = additionalFields[i].querySelector('input');
      if (input) {
        additionalData[input.name] = input.value;
      }
    }

    var data = {
      Nombre: nombreMaterial,
      Cantidad: cantidadMaterial,
      ISBN: additionalData.ISBNMaterial ? document.getElementById('ISBNMaterial').value : undefined,
      Año_de_Publicacion: additionalData.Año_de_PublicaciónMaterial ? document.getElementById('Año_de_PublicaciónMaterial').value : undefined,
      Asignatura: additionalData.AsignaturaMaterial ? document.getElementById('AsignaturaMaterial').value : undefined,
      Autor: additionalData.AutorMaterial ? document.getElementById('AutorMaterial').value : undefined,
      Modelo: additionalData.ModeloMaterial ? document.getElementById('ModeloMaterial').value : undefined
    };

    fetch(`${window._env_.BASE_API_URL}/material/${tipoMaterial}`, {
      method: 'POST',
      headers: {
        'auth': sessionStorage.getItem('id_token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(function(response) {
      if(response.ok) {
        alert(response.json().message);
        window.location.href = '../materials.html';
      } else {
        return response.json().then(function(error) {
          throw new Error(error.message);
        });
      }
    })
    .catch(function(error) {
      alert(`Error al agregar material: ${error.message}`);
    });
  });

  document.getElementById('TipoMaterial').addEventListener('change', function(event) {
    var materialType = event.target.value;
    updateAdditionalFields(materialType);
  });
});