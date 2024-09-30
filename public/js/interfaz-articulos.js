// interfaz-articulos.js
document.getElementById('add-article-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const contenido = document.getElementById('contenido').value;

    // Lógica para agregar un nuevo artículo
    fetch('/api/articulos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ titulo, contenido })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Artículo agregado con éxito');
            // Aquí podrías refrescar la lista de artículos
        } else {
            alert('Error al agregar artículo');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud de agregar artículo:', error);
    });
});
