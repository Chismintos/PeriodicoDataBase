const express = require('express');
const path = require('path');
const session = require('express-session');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); // Asegúrate de instalar bcrypt
const articulosRoutes = require('./routes/articulosdb');

const app = express();
app.set('port', 3000);

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'llluuuhhh',
    database: 'periodico'
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(session({
    secret: 'mi_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para manejar artículos
app.use('/api/articulos', articulosRoutes);

// Ruta para la página de inicio de sesión
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Ruta para mostrar artículos
app.get('/articulos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'articulos.html'));
});

// Ruta para manejar el inicio de sesión
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    console.log('Intentando iniciar sesión con:', username, password);

    // Aquí deberías verificar el usuario y la contraseña
    const query = 'SELECT * FROM Usuarios WHERE username = ? AND password = ?';
    connection.query(query, [username, password], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error en la base de datos' });
        }

        if (results.length > 0) {
            // Autenticación exitosa
            req.session.username = username; // Guardar información del usuario en la sesión
            req.session.role = results[0].role; // Guardar el rol del usuario en la sesión
            res.json({ message: 'Inicio de sesión exitoso', role: req.session.role });
        } else {
            // Autenticación fallida
            res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
        
    });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
