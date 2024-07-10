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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.id_token)
      sessionStorage.setItem('id_token', data.id_token)

      if (data.id_token != null) {
        var token = data.id_token.split('.')[1];
        var decodedToken = JSON.parse(atob(token));
        sessionStorage.setItem('rol', decodedToken['cognito:groups'][0]);
        sessionStorage.setItem('email', decodedToken.email);
        sessionStorage.setItem('name', decodedToken.name);
      }
      window.location.href = '../../index.html';
    })
    .catch(error => {
      alert('Usuario o contraseña incorrectos');
    })
  });
});
