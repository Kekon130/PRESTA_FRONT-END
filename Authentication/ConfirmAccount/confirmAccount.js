document.addEventListener('DOMContentLoaded', function() {
  var confirmAccountForm = document.getElementById('confirmAccountForm');
  var queryParams = getQueryParams();

  confirmAccountForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var email = queryParams.email;
    var code = document.getElementById('confirmAccountCode').value;

    var userData = {
      confirmation_code: code
    };

    fetch(`${window._env_.BASE_API_URL}/registro/${email}`, {
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
        return response.json().then(function(error) {
          throw new Error(error.message);
        });
      }
    })
    .catch(function(error) {
      alert(`Error al confirmar la cuenta: ${error.message}`);
    });
  });
});