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
                <p>Autor: ${articulo.autor} | Fecha: ${new Date(articulo.fechaPublicacion).toLocaleDateString()} | Id: ${articulo.articulo_id} </p> 
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
            const optionsMessage = document.createElement('p');
            optionsMessage.textContent = 'Eres un Administrador. Puedes insertar, actualizar y borrar artículos.';
            optionsMessage.style.fontWeight = 'bold';
            container.prepend(optionsMessage);
            
            const addArticleButton = document.createElement('button');
            addArticleButton.textContent = 'Agregar Artículo';
            addArticleButton.addEventListener('click', mostrarFormularioArticulo);
            container.appendChild(addArticleButton);
            
            // Agregar la opción de actualizar artículos
            const updateArticleButton = document.createElement('button');
            updateArticleButton.textContent = 'Actualizar Artículo';
            updateArticleButton.addEventListener('click', mostrarFormularioActualizarArticulo);
            container.appendChild(updateArticleButton);
            
            // Agregar la opción de borrar artículos
            const deleteArticleButton = document.createElement('button');
            deleteArticleButton.textContent = 'Borrar Artículo';
            deleteArticleButton.addEventListener('click', mostrarFormularioBorrarArticulo);
            container.appendChild(deleteArticleButton);
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
            <div class="input-group">
                <label for="titulo">Título</label>
                <input type="text" id="titulo" name="titulo" required>
            </div>
            <div class="input-group">
                <label for="contenido">Contenido</label>
                <textarea id="contenido" name="contenido" required></textarea>
            </div>
            <div class="input-group">
                <label for="autor_id">Autor ID</label>
                <input type="number" id="autor_id" name="autor_id" required>
            </div>
            <div class="input-group">
                <label for="categoria_id">Categoría ID</label>
                <input type="number" id="categoria_id" name="categoria_id" required>
            </div>
            <div class="input-group">
                <label for="fechaPublicacion">Fecha de Publicación</label>
                <input type="date" id="fechaPublicacion" name="fechaPublicacion" required>
            </div>
            <button type="submit">Agregar Artículo</button>
        </form>
    `;
    document.getElementById('articulos').appendChild(formContainer);

    // Manejar el envío del formulario
    document.getElementById('add-article-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener los valores del formulario
        const titulo = document.getElementById('titulo').value;
        const contenido = document.getElementById('contenido').value;
        const autor_id = document.getElementById('autor_id').value;
        const categoria_id = document.getElementById('categoria_id').value;
        const fechaPublicacion = document.getElementById('fechaPublicacion').value;

        // Realizar la solicitud para insertar el artículo en el backend
        const response = await fetch('/api/articulos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo,
                contenido,
                autor_id,
                categoria_id,
                fechaPublicacion
            })
        });

        if (response.ok) {
            alert('Artículo agregado exitosamente');
            // Recargar los artículos
            location.reload();
        } else {
            const data = await response.json();
            alert('Error al agregar el artículo: ' + data.message);
        }
    });
}


function mostrarFormularioActualizarArticulo() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <h3>Actualizar Artículo</h3>
        <head>
        <link rel="stylesheet" type="text/css" href="styles.css">
        </head>
        <form id="update-article-form">
            <div class="input-group">
                <label for="update-id">ID del Artículo</label>
                <input type="number" id="update-id" name="update-id" required>
            </div>
            <div class="input-group">
                <label for="update-titulo">Título</label>
                <input type="text" id="update-titulo" name="update-titulo" required>
            </div>
            <div class="input-group">
                <label for="update-contenido">Contenido</label>
                <textarea id="update-contenido" name="update-contenido" required></textarea>
            </div>
            <div class="input-group">
                <label for="update-fechaPublicacion">Fecha de Publicación</label>
                <input type="date" id="update-fechaPublicacion" name="update-fechaPublicacion" required>
            </div>
            <div class="input-group">
                <label for="update-autor_id">ID del Autor</label>
                <input type="number" id="update-autor_id" name="update-autor_id" required>
            </div>
            <div class="input-group">
                <label for="update-categoria_id">ID de la Categoría</label>
                <input type="number" id="update-categoria_id" name="update-categoria_id" required>
            </div>
            <button type="submit">Actualizar Artículo</button>
        </form>
    `;
    document.getElementById('articulos').appendChild(formContainer);

    // Manejar el envío del formulario
    document.getElementById('update-article-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener los valores del formulario
        const id = document.getElementById('update-id').value;
        const titulo = document.getElementById('update-titulo').value;
        const contenido = document.getElementById('update-contenido').value;
        const fechaPublicacion = document.getElementById('update-fechaPublicacion').value;
        const autor_id = document.getElementById('update-autor_id').value; // Obtener ID del autor
        const categoria_id = document.getElementById('update-categoria_id').value; // Obtener ID de la categoría

        // Realizar la solicitud para actualizar el artículo en el backend
        const response = await fetch(`/api/articulos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo,
                contenido,
                autor_id, // Enviar ID del autor
                categoria_id,
                fechaPublicacion,
                
            })
        });

        if (response.ok) {
            alert('Artículo actualizado exitosamente');
            location.reload(); // Recargar los artículos
        } else {
            const data = await response.json();
            alert('Error al actualizar el artículo: ' + data.message);
        }
    });
}

function mostrarFormularioBorrarArticulo() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <h3>Borrar Artículo</h3>
        <form id="delete-article-form">
            <div class="input-group">
                <label for="delete-id">ID del Artículo</label>
                <input type="number" id="delete-id" name="delete-id" required>
            </div>
            <button type="submit">Borrar Artículo</button>
        </form>
    `;
    document.getElementById('articulos').appendChild(formContainer);

    // Manejar el envío del formulario
    document.getElementById('delete-article-form').addEventListener('submit', async (e) => {
        e.preventDefault();
    
        // Obtener el ID del formulario
        const id = document.getElementById('delete-id').value;
        console.log('ID a borrar:', id); // Para depuración
    
        // Realizar la solicitud para borrar el artículo en el backend
        try {
            const response = await fetch(`/api/articulos/${id}`, {
                method: 'DELETE'
            });
    
            if (response.ok) {
                alert('Artículo borrado exitosamente');
                location.reload(); // Recargar los artículos
            } else {
                const data = await response.json();
                alert('Error al borrar el artículo: ' + data.message);
                console.error('Error en la eliminación:', data); // Para ver detalles en la consola
            }
        } catch (error) {
            console.error('Error en la solicitud:', error); // Captura cualquier error de red
            alert('Error en la solicitud de eliminación.');
        }
    });
    
}


async function obtenerArticulo(id) {
    const response = await fetch(`/api/articulos/${id}`);
    const articulo = await response.json();

    // Rellenar el formulario con los datos del artículo
    document.getElementById('update-titulo').value = articulo.titulo;
    document.getElementById('update-contenido').value = articulo.contenido;
    document.getElementById('update-fechaPublicacion').value = articulo.fechaPublicacion;
}

