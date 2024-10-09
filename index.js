const express = require('express');
const path = require('path');
const session = require('express-session');
const mysql = require('mysql2');
const articulosRoutes = require('./routes/articulosdb');

const app = express();
app.set('port', 3000);

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

// Función para autenticar al usuario en la base de datos
function authenticateUser(username, password, callback) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: username,     // Usuario ingresado desde el frontend (userDesarrollador, userLectura, etc.)
        password: password, // Contraseña ingresada desde el frontend
        database: 'periodico'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error de autenticación:', err);
            callback(null, 'Error de autenticación');
        } else {
            console.log('Conexión exitosa como:', username);
            callback(connection, null);  // Devuelve la conexión si es exitosa
        }
    });
}

// Ruta para manejar el inicio de sesión
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    console.log('Intentando iniciar sesión con:', username, password);

    // Usar la función para autenticar
    authenticateUser(username, password, (connection, error) => {
        if (error) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Dependiendo del usuario conectado, asignar un tipo de usuario
        let userType;
        if (username === 'userDesarrollador') {
            userType = 'Desarrollador'; // Cambiado a 'Desarrollador'
        } else if (username === 'userLectura') {
            userType = 'Lector'; // Cambiado a 'Lector'
        } else if (username === 'userDBA') {
            userType = 'Administrador'; // Cambiado a 'Administrador'
        }

        // Guardar el tipo de usuario en sesión
        req.session.userType = userType;
        
        // Puedes usar la conexión más adelante si lo necesitas
        connection.end();  // Cierra la conexión después de la autenticación
        
        res.json({ message: 'Inicio de sesión exitoso', role: userType }); // Cambiado a 'role'
    });
});


// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
