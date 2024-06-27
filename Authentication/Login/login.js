document.addEventListener('DOMContentLoaded', function() {
  var loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPassword').value;

    var userData = {
      email: email,
      password: password
    };

    fetch(`${window._env_.BASE_API_URL}/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
      document.cookie = `id_token=${data.id_token}; path=/`;
      window.location.href = '../../index.html';
    })
    .catch(error => {
      alert('Usuario o contraseña incorrectos');
    })
  });
});
