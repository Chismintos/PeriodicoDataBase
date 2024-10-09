const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'llluuuhhh',
    database: 'periodico'
});

// Middleware para verificar roles
function checkRole(role) {
    return (req, res, next) => {
        if (req.session.role === role) {
            next(); // El usuario tiene el rol adecuado
        } else {
            res.status(403).json({ message: 'Acceso denegado' }); // Acceso denegado
        }
    };
}

// Ruta para crear artículos (solo para 'developer_role')
router.post('/', (req, res) => {
    const { titulo, contenido, autor_id, categoria_id, fechaPublicacion } = req.body;

    const query = 'INSERT INTO Articulos (titulo, contenido, autor_id, categoria_id, fechaPublicacion) VALUES (?, ?, ?, ?, ?)';
    
    connection.query(query, [titulo, contenido, autor_id, categoria_id, fechaPublicacion], (err, result) => {
        if (err) {
            console.error('Error al insertar el artículo:', err);
            return res.status(500).json({ message: 'Error al insertar el artículo' });
        }
        res.status(200).json({ message: 'Artículo agregado exitosamente' });
    });
});




// Ruta para obtener todos los artículos con el nombre del autor
router.get('/', (req, res) => {
    const query = `
        SELECT 
            Articulos.articulo_id, 
            Articulos.titulo, 
            Articulos.contenido, 
            Autores.nombre AS autor,  -- Aquí obtenemos el nombre del autor
            Articulos.fechaPublicacion 
        FROM 
            Articulos
        JOIN 
            Autores ON Articulos.autor_id = Autores.autor_id;  -- Relación entre Articulos y Autores
    `;

    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error al obtener artículos', error });
        }
        res.status(200).json(results);
    });
});


// Ruta para obtener un artículo por ID (acceso general)


router.get('/api/articulos', (req, res) => {
    const query = `
        SELECT 
            Articulos.articulo_id, 
            Articulos.titulo, 
            Articulos.contenido, 
            Autores.nombre AS autor,  -- Aquí se obtiene el nombre del autor
            Articulos.fechaPublicacion 
        FROM 
            Articulos
        JOIN 
            Autores ON Articulos.autor_id = Autores.autor_id;  -- Join entre Articulos y Autores
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los artículos:', err);
            res.status(500).json({ error: 'Error al obtener los artículos' });
        } else {
            res.json(results);  // Aquí se devuelven los resultados con el nombre del autor
        }
    });
});


// Ruta para actualizar un artículo (solo para 'developer_role')
router.put('/:id', checkRole('developer_role'), (req, res) => {
    const { id } = req.params;
    const { titulo, contenido, autor_id, categoria_id } = req.body;
    const query = 'UPDATE Articulos SET titulo = ?, contenido = ?, autor_id = ?, categoria_id = ? WHERE articulo_id = ?';
    connection.query(query, [titulo, contenido, autor_id, categoria_id, id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error al actualizar el artículo', error });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        res.status(200).json({ message: 'Artículo actualizado exitosamente' });
    });
});

// Ruta para eliminar un artículo (solo para 'developer_role')
router.delete('/:id', checkRole('developer_role'), (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Articulos WHERE articulo_id = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error al eliminar el artículo', error });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        res.status(200).json({ message: 'Artículo eliminado exitosamente' });
    });
});

module.exports = router;
