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
            Autores.nombre AS autor,  
            Articulos.fechaPublicacion 
        FROM 
            Articulos
        JOIN 
            Autores ON Articulos.autor_id = Autores.autor_id;  
    `;

    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error al obtener artículos', error });
        }
        res.status(200).json(results);
    });
});

// Ruta para actualizar un artículo (sin verificación de rol)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, contenido, autor_id, categoria_id, fechaPublicacion } = req.body;
    
    // Crear un array para almacenar las partes del query y los valores a actualizar
    const updates = [];
    const values = [];

    // Solo agregar los campos que se han enviado
    if (titulo) {
        updates.push('titulo = ?');
        values.push(titulo);
    }
    if (contenido) {
        updates.push('contenido = ?');
        values.push(contenido);
    }
    if (autor_id) {
        updates.push('autor_id = ?');
        values.push(autor_id);
    }
    if (categoria_id) {
        updates.push('categoria_id = ?');
        values.push(categoria_id);
    }
    if (fechaPublicacion) {
        updates.push('fechaPublicacion = ?');
        values.push(fechaPublicacion);
    }

    // Asegurarse de que haya al menos un campo para actualizar
    if (updates.length === 0) {
        return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    // Agregar el id al final de los valores
    values.push(id);

    const query = `UPDATE Articulos SET ${updates.join(', ')} WHERE articulo_id = ?`;
    
    connection.query(query, values, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error al actualizar el artículo', error });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        res.status(200).json({ message: 'Artículo actualizado exitosamente' });
    });
});


// Ruta para eliminar un artículo (sin verificación de rol)
router.delete('/:id', (req, res) => {
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
