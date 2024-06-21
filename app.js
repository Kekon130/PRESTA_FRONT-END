document.addEventListener('DOMContentLoaded', () => {
  checkUserAuthentication();
});

function checkUserAuthentication() {
  var token = getCookie('id_token');

  print(token)

  if (token) {
    document.getElementById('authButtons').style.display = 'none';
    document.getElementById('userLink').style.display = 'block';

    document.getElementById('userLink').addEventListener('click', () => {
      window.location.href = '/profile';
    });

    document.getElementById('logoutButton').addEventListener('click', () => {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      window.location.href = './Authentication/login.html';
    });
  } else {
    document.getElementById('authButtons').style.display = 'block';
    document.getElementById('userLink').style.display = 'none';
  }
}

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