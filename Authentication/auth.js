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

    fetch('https://qfqzi5nng6.execute-api.eu-north-1.amazonaws.com/Second_Sprint/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
      document.cookie = `id_token=${data.id_token}; path=/`;
      window.location.href = '../index.html';
    })
    .catch(error => {
      console.error(error)
    })
  });
});
