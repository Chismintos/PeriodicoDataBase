const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Crear una conexión con tu base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'llluuuhhh',
    database: 'periodico'
});

// Verificar la conexión
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos: ', err.stack);
        return;
    }
    console.log('Conectado a la base de datos');
});


// Ruta para obtener todos los artículos con información del autor
router.get('/', (req, res) => {
    const query = `
        SELECT 
            a.articulo_id,
            a.titulo,
            a.contenido,
            aut.nombre AS autor,  -- Suponiendo que tu tabla de autores tiene la columna 'nombre'
            a.fechaPublicacion 
        FROM Articulos a
        JOIN Autores aut ON a.autor_id = aut.autor_id;  -- Asegúrate de usar el nombre correcto de la columna
    `;
    
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).send('Error al obtener artículos');
        }
        res.json(results); // Retorna los artículos en formato JSON
    });
});

// Ruta para crear un nuevo artículo (puedes agregar lógica aquí)
router.post('/', (req, res) => {
    // Lógica para agregar un artículo
});

// Otras rutas relacionadas con artículos...

module.exports = router;
