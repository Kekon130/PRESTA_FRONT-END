document.addEventListener('DOMContentLoaded', function() {
  function checkSession() {
    var token = getCookie('id_token');
    if(!token) {
      window.location.href = '../Authentication/login.html';
    }
  }

  //checkSession();

  var materialsList = document.getElementById('materialsList');

  fetch('https://qfqzi5nng6.execute-api.eu-north-1.amazonaws.com/Second_Sprint/material', {
    method: 'GET',
    headers: {
      'auth': 'eyJraWQiOiJvRkZ5V1o5ODE2ZnFaZklFNGh4U3M3MVRqYjJENEFzc1ZRVERyVXgyRmhZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3MGNjNjkwYy01MDAxLTcwMjgtNzZjYy1kZTQ5ZTNhMjczYmUiLCJjb2duaXRvOmdyb3VwcyI6WyJHZXN0b3JlcyJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LW5vcnRoLTEuYW1hem9uYXdzLmNvbVwvZXUtbm9ydGgtMV9VYThqak1BMFoiLCJjb2duaXRvOnVzZXJuYW1lIjoiNzBjYzY5MGMtNTAwMS03MDI4LTc2Y2MtZGU0OWUzYTI3M2JlIiwib3JpZ2luX2p0aSI6IjUzOGJhZjdmLTk0YTctNDg1Mi1hMTcyLWEzZGFmNDBkMzMyOCIsImF1ZCI6IjE4Ym1uczU2bjF2c2VqaTZpNmwwaGUzdXBiIiwiZXZlbnRfaWQiOiIxMWNlY2U1YS0wMGUzLTQzNTctYTFiZi03N2E3N2JlOTQ2NjMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcxODk4NDU3MCwibmFtZSI6IlZpY3RvcmlhIFBlbGFkbyBTw6FuY2hleiIsImV4cCI6MTcxODk4ODE3MCwiaWF0IjoxNzE4OTg0NTcwLCJqdGkiOiJlZGNlZmExZi01ZDc5LTRjYzktYmVhOC1iOGZkNTI1M2ZkZmEiLCJlbWFpbCI6InZpY3RvcmlhLnBlbGFkb0BhbHVtbm9zLnVwbS5lcyJ9.Qs3agGldt4fqoI9_thSvkRLn4ydQ_6q43nEFk0pf_PEUcIADnZW28cOpFpowx9uUud6SSpiuvHffOue8UnUBJluNO05zfXL7C38HEdNJiIdFpRk6BiSqxWm-scdJhwg5_B3SKb20ceLZpoV4c7Cw4gqPRoZ3F_QDiDIrWktjQUEoCPlcyyLbHDNOKTAX5NN39eggDKfO1qGyKyGCShk7ZiGM6Cp2Lx1eXwQ-Ni4fZQevD2Z4IEwc9rVxw0PvhOYlogs0mvANErN_kEKp07pUsXImlk4_2H0cClMl08kw-dRZm0AmD6CXvOlHhrycAPcSSvR3LXzAZXThXJHt_xOyqA'
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
      materialsHTML += `<h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3>`;

      data[key].forEach(function(material) {
        materialsHTML += `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${material.Nombre}</h5>
                <p class="card-text">Disponibles: ${material.Unidades_Disponibles}</p>
                ${material.ISBN ? `<p class="card-text">ISBN: ${material.ISBN}</p>` : ''}
                ${material.Autor ? `<p class="card-text">Autor: ${material.Autor}</p>` : ''}
                ${material.Modelo ? `<p class="card-text">Modelo: ${material.Modelo}</p>` : ''}
                <p class="card-text">Asignatura: ${material.Asignatura}</p>
            </div>
        </div>`;
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