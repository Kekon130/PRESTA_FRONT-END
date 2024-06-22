document.addEventListener('DOMContentLoaded', function() {
  function checkSession() {
    var token = getCookie('id_token');
    if(!token) {
      window.location.href = '../Authentication/login.html';
    }
  }

  checkSession();

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
      console.log(materialsType);
      materialsHTML += `<h3>${materialsType}</h3>`;

      data[key].forEach(function(material, index) {
        var materialID = index + 1;
        materialsHTML += `
        <a href="./MaterialDetails/materialDetails.html?id=${encodeURIComponent(materialID)}&type=${encodeURIComponent(materialsType)}" class="mb-3 text-decoration-none text-dark">
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