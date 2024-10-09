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
        
        // Imprimir el userType en la consola
        console.log('User Type:', userType); // Esto mostrará el tipo de usuario en la consola

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
        console.log('User Type:', userType); // Verifica qué rol está recuperando
        // Opciones adicionales según el tipo de usuario
        
        if (userType === 'Lector') {
            const optionsMessage = document.createElement('p');
            optionsMessage.textContent = 'Eres un lector. Solo puedes ver los artículos.';
            optionsMessage.style.fontWeight = 'bold';
            container.prepend(optionsMessage);
        } else if (userType === 'Desarrollador') {
            const optionsMessage = document.createElement('p');
            optionsMessage.textContent = 'Eres un Desarrollador. Puedes Insertar artículos.';
            optionsMessage.style.fontWeight = 'bold';
            container.prepend(optionsMessage);
            
            const addArticleButton = document.createElement('button');
            addArticleButton.textContent = 'Agregar Artículo';
            addArticleButton.addEventListener('click', mostrarFormularioArticulo);
            container.appendChild(addArticleButton);
        } else if (userType === 'Administrador') {
            // Agrega la lógica para el administrador si es necesario
        }

        // Aquí puedes agregar más condiciones para otros tipos de usuarios en el futuro
    })
    .catch(error => {
        console.error('Error al cargar los artículos:', error);
    });

// Función para mostrar el formulario de agregar artículo
function mostrarFormularioArticulo() {
    // Aquí puedes implementar la lógica para mostrar el formulario
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <h3>Agregar Artículo</h3>
        <form id="add-article-form">
            <div>
                <label for="titulo">Título:</label>
                <input type="text" id="titulo" name="titulo" required>
            </div>
            <div>
                <label for="contenido">Contenido:</label>
                <textarea id="contenido" name="contenido" required></textarea>
            </div>
            <button type="submit">Insertar Artículo</button>
        </form>
    `;
    document.getElementById('articulos').appendChild(formContainer);

    // Manejar el envío del formulario
    document.getElementById('add-article-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const titulo = document.getElementById('titulo').value;
        const contenido = document.getElementById('contenido').value;

        // Realiza la solicitud para insertar el artículo en el backend
        const response = await fetch('/api/articulos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo, contenido })
        });

        if (response.ok) {
            alert('Artículo agregado exitosamente');
            // Recargar los artículos
            location.reload();
        } else {
            alert('Error al agregar el artículo');
        }
    });
}
