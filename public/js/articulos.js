fetch('/api/articulos')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la red');
        }
        return response.json();
        
    })
    .then(data => {
        const container = document.getElementById('articulos'); // Ahora coincide con el id en el HTML
        
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
        
    })
    .catch(error => {
        console.error('Error al cargar los artículos:', error);
    });
