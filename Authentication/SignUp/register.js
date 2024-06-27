document.addEventListener('DOMContentLoaded', function() {
  var registerForm = document.getElementById('registerForm');

  registerForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var email = document.getElementById('registerEmail').value;
    var password = document.getElementById('registerPassword').value;
    var confirmPassword = document.getElementById('registerConfirmPassword').value;
    var name = document.getElementById('registerName').value;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    } else {
      var userData = {
        email: email,
        password: password,
        name: name
      };
  
      fetch(`${window._env_.API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })
      .then(response => response.json())
      .then(data => {
        alert('Usuario registrado correctamente');
        window.location.href = `../ConfirmAccount/confirmAccount.html?email=${encodeURIComponent(email)}`;
      })
      .catch(error => {
        alert(`Error al registrar usuario: ${error.message}`);
      });
    }
  });
});