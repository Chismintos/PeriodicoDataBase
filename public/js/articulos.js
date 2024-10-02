fetch('/api/articulos')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la red');
        }
        return response.json();
    })
    .then(data => {
        const container = document.getElementById('articulos');
        const userType = localStorage.getItem('userType'); // Obtiene el tipo de usuario

        // Verificar si hay datos
        if (data.length === 0) {
            container.innerHTML = '<p>No hay artículos disponibles.</p>';
            return;
        }

        // Crear artículos y agregarlos al contenedor
        data.forEach(articulo => {
            const articleElement = document.createElement('article');
            articleElement.innerHTML = `
                <h2>${articulo.titulo}</h2>
                <p>${articulo.contenido}</p>
                <p>Autor: ${articulo.autor} | Fecha: ${new Date(articulo.fechaPublicacion).toLocaleDateString()}</p>
            `;
            container.appendChild(articleElement);
        });

        // Opciones adicionales según el tipo de usuario
        if (userType === 'lector') {
            // Aquí puedes agregar un mensaje o una sección que indique que el lector solo puede ver artículos
            const optionsMessage = document.createElement('p');
            optionsMessage.textContent = 'Tienes acceso solo para leer los artículos.';
            optionsMessage.style.fontWeight = 'bold';
            container.prepend(optionsMessage);
        }

        // Aquí puedes agregar más condiciones para otros tipos de usuarios en el futuro
    })
    .catch(error => {
        console.error('Error al cargar los artículos:', error);
    });


    