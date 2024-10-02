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
router.post('/', checkRole('developer_role'), (req, res) => {
    const { titulo, contenido, autor_id, categoria_id } = req.body;
    const query = 'INSERT INTO Articulos (titulo, contenido, autor_id, categoria_id, fechaPublicacion) VALUES (?, ?, ?, ?, NOW())';
    connection.query(query, [titulo, contenido, autor_id, categoria_id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error al crear el artículo', error });
        }
        res.status(201).json({ message: 'Artículo creado exitosamente', articulo_id: results.insertId });
    });
});

// Ruta para obtener todos los artículos (acceso general)
router.get('/', (req, res) => {
    const query = 'SELECT * FROM Articulos';
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error al obtener artículos', error });
        }
        res.status(200).json(results);
    });
});

// Ruta para obtener un artículo por ID (acceso general)
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Articulos WHERE articulo_id = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error al obtener el artículo', error });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        res.status(200).json(results[0]);
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
