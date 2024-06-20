document.addEventListener('DOMContentLoaded', () => {
  checkUserAuthentication();
});

function checkUserAuthentication() {
  const idToken = Cookies.get('id_token');
  if (idToken) {
      const payload = parseJwt(idToken);
      const userName = payload.name || payload.email; // Usa el nombre del usuario o el correo si no hay nombre
      document.getElementById('authButtons').classList.add('d-none');
      document.getElementById('profileButton').textContent = userName;
      document.getElementById('userLink').classList.remove('d-none');
  }
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}