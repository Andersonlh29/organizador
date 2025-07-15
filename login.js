document.getElementById('loginBtn').addEventListener('click', iniciarSesion);
document.getElementById('registerBtn').addEventListener('click', registrarUsuario);

function iniciarSesion() {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

  if (usuarios[email] && usuarios[email] === pass) {
    localStorage.setItem("usuarioActivo", email);
    window.location.href = "dashboard.html"; // Redirige al panel
  } else {
    alert("Credenciales inválidas o usuario no registrado.");
  }
}

function registrarUsuario() {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;

  if (!email || !pass) {
    alert("Complete correo y contraseña.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

  if (usuarios[email]) {
    alert("Usuario ya existe.");
  } else {
    usuarios[email] = pass;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Usuario registrado correctamente.");
  }
}
