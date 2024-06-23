document.addEventListener('DOMContentLoaded', function() {
  var userRoles = window._env_.USER_ROLES;

  function checkSession() {
    var token = getCookie('id_token');
    if (!token) {
      window.location.href = '../../Authentication/login.html';
    }
  }

  checkSession();

  function getQueryParams() {
    var queryParams = {};
    var queryString = window.location.search.slice(1);
    var queryArray = queryString.split('&');

    queryArray.forEach(function(query) {
      var queryPair = query.split('=');
      queryParams[decodeURIComponent(queryPair[0])] = decodeURIComponent(queryPair[1]);
    });

    return queryParams;
  }

  function getUserRol() {
    var token = getCookie('id_token');    
    var payload = token.split('.')[1];
    var decodedPayload = atob(payload);
    var payloadObj = JSON.parse(decodedPayload);
    return payloadObj['cognito:groups'] || [];
  }

  var params = getQueryParams();
  var materialID = params.id;
  var materialType = params.type;

  var materialDetails = document.getElementById('materialDetails');

  fetch(`${window._env_.BASE_API_URL}/material/${materialType}/${materialID}`, {
    method: 'GET',
    headers: {
      auth: getCookie('id_token')
    }
  })
  .then(function(response) {
    if (response.ok) {
      return response.json();
    } else {
      return response.json().then(function(error) {
        throw new Error(error.message);
      });
    }
  })
  .then(function(data) {
    var material = data.Material;
    var materialDetailsHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${material.Nombre}</h5>
          <p class="card-text">Unidades Totales: ${material.Cantidad}</p>
          <p class="card-text">Disponibles: ${material.Unidades_Disponibles}</p>
          ${material.ISBN ? `<p class="card-text">ISBN: ${material.ISBN}</p>` : ''}
          ${material.Año_de_Publicacion ? `<p class="card-text">Año de Publicación: ${material.Año_de_Publicacion}</p>` : ''}
          ${material.Autor ? `<p class="card-text">Autor: ${material.Autor}</p>` : ''}
          ${material.Modelo ? `<p class="card-text">Modelo: ${material.Modelo}</p>` : ''}
          ${material.Asignatura ? `<p class="card-text">Asignatura: ${material.Asignatura}</p>` : ''}
        </div>
        <div class="card-footer">
          <button class="btn btn-primary" id="reserveButton">Reservar</button>
          <button class="btn btn-warning" id="editButton" style="display: none;">Modificar</button>
          <button class="btn btn-danger" id="deleteButton" style="display: none;">Eliminar</button>
        </div>
      </div>`;

    materialDetails.innerHTML = materialDetailsHTML;

    document.getElementById('editButton').addEventListener('click', function() {
      localStorage.setItem('materialData', JSON.stringify(material));
      window.location.href = `../MaterialsEdit/editMaterial.html?type=${encodeURIComponent(materialType)}&id=${encodeURIComponent(materialID)}`;
    });

    document.getElementById('deleteButton').addEventListener('click', function() {
      var confirmation = confirm('¿Está seguro que desea eliminar este material?');
      if (confirmation) {
        fetch(`${window._env_.BASE_API_URL}/material/${materialType}/${materialID}`, {
          method: 'DELETE',
          headers: {
            auth: getCookie('id_token')
          }
        })
        .then(function(response) {
          if (!response.ok) {
            return response.json().then(function(error) {
              throw new Error(error.message);
            });
          } else {
            return response.json();
          }
        })
        .then(function(data) {
          alert(data.message);
          window.location.href = '../Materials/materials.html';
        })
        .catch(function(error) {
          alert(`Error al eliminar el material: ${error.message}`);
        });
      }
    });

    var userRol = getUserRol();
    if (userRol.includes(userRoles.GESTORES)) {
      document.getElementById('editButton').style.display = 'inline-block';
      document.getElementById('deleteButton').style.display = 'inline-block';
    }
  })
  .catch(function(error) {
    console.log(error);
    materialDetails.innerHTML = `<p>Error al cargar el material: ${error.message}.</p>`;
  });
});

function getCookie(name) {
  var cookieArr = document.cookie.split(';');

  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split('=');
    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
}