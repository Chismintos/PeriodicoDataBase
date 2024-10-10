document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const messageBox = document.createElement('div'); // Creamos el modal
    const messageContent = document.createElement('p');
    const closeButton = document.createElement('button');

    // Configurar el modal
    messageBox.style.display = 'none';
    messageBox.style.position = 'fixed';
    messageBox.style.left = '50%';
    messageBox.style.top = '50%';
    messageBox.style.transform = 'translate(-50%, -50%)';
    messageBox.style.backgroundColor = 'white';
    messageBox.style.padding = '20px';
    messageBox.style.border = '2px solid #007bff';
    messageBox.style.borderRadius = '10px';
    messageBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    messageBox.style.zIndex = '1000';
    messageContent.style.textAlign = 'center';

    closeButton.textContent = 'Aceptar';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#007bff';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';

    closeButton.addEventListener('click', () => {
        messageBox.style.display = 'none'; // Ocultar el modal al hacer clic
        if (messageContent.textContent.includes('Inicio de sesión exitoso')) {
            // Redirigir a la página de artículos después de cerrar el modal
            window.location.href = '/articulos';  // Cambia '/articulos' a la ruta correcta
        }
    });

    messageBox.appendChild(messageContent);
    messageBox.appendChild(closeButton);
    document.body.appendChild(messageBox); // Añadir el modal al body

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evitar que el formulario se envíe de manera tradicional
    
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
    
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
        
            const result = await response.json();
            console.log(result); // Para verificar lo que se devuelve
        
            if (response.ok) {
                // Almacenar el tipo de usuario en localStorage
                localStorage.setItem('userType', result.role); // Almacena el tipo de usuario
    
                // Mostrar mensaje de éxito
                messageContent.textContent = `Inicio de sesión exitoso. Bienvenido ${result.role}.`;
                messageBox.style.display = 'block'; // Mostrar el modal
            } else {
                // Mostrar mensaje de error
                messageContent.textContent = 'Credenciales incorrectas. Intente nuevamente.';
                messageBox.style.display = 'block'; // Mostrar el modal
            }
        
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            messageContent.textContent = 'Hubo un error al conectarse con el servidor. Por favor, inténtelo más tarde.';
            messageBox.style.display = 'block'; // Mostrar el modal
        }
    });
    
});
