// login.js
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Lógica para enviar la información de inicio de sesión a tu servidor
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirigir al usuario a la página de artículos
            window.location.href = 'articulos.html';
        } else {
            alert('Error al iniciar sesión');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud de inicio de sesión:', error);
    });
});
