document.addEventListener('DOMContentLoaded', function() {
  function getQueryParams() {
    var queryParams = {};
    var search = window.location.search.substring(1);
    var query = search.split('&');
    for (var i = 0; i < query.length; i++) {
      var pair = query[i].split('=');
      queryParams[pair[0]] = pair[1];
    }
    return queryParams;
  }

  var confirmAccountForm = document.getElementById('confirmAccountForm');
  var queryParams = getQueryParams();

  confirmAccountForm.addEventListener('submit', function(event) {
    var email = queryParams.email;
    var code = document.getElementById('confirmationCode').value;

    var userData = {
      code: code
    };

    fetch(`${window._env_.API_URL}/registro/${userData.email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })
    .then(function(response) {
      if (response.ok) {
        alert('Cuenta confirmada correctamente');
        window.location.href = '../Login/login.html';
      } else {
        alert('Error al confirmar la cuenta');
      }
    })
    .catch(function(error) {
      alert(`Error al confirmar la cuenta: ${error.message}`);
    });
  });
});