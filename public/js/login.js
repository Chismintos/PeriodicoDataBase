document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Asegúrate de que tu backend devuelva el rol del usuario
            localStorage.setItem('userType', data.role); // Almacena el rol del usuario
            alert(data.message);
            window.location.href = '/articulos'; // Redirigir a la página de artículos
        } else {
            alert(data.message);
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log('Rol recibido del backend:', data.role); // Esto debería mostrar el rol
            localStorage.setItem('userType', data.role); // Almacena el rol del usuario
            alert(data.message);
            window.location.href = '/articulos'; // Redirigir a la página de artículos
        } else {
            alert(data.message);
        }
    });
});
