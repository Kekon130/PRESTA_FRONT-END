document.addEventListener('DOMContentLoaded', function() {
  var confirmAccountForm = document.getElementById('confirmAccountForm');
  var queryParams = getQueryParams();

  confirmAccountForm.addEventListener('submit', function(event) {
    var email = queryParams.email;
    var code = document.getElementById('confirmationCode').value;

    var userData = {
      code: code
    };

    fetch(`${window._env_.API_URL}/registro/${email}`, {
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