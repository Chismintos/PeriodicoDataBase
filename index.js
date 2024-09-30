const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const articulosRoutes = require('./routes/articulosdb');
// const autoresRoutes = require('./routes/autoresdb');
// settings
app.set('port', 3000)


// middleware
app.use(express.static(path.join(__dirname, 'public')));

// Para poder manejar JSON en peticiones
app.use(express.json());
// Configuración de la sesión
app.use(session({
    secret: 'mi_secreto', // Cambia esto a algo seguro
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

// Para manejar artículos js 
app.use('/api/articulos', articulosRoutes);

// Para manejar autores js
// app.use('/autoresdb', autoresRoutes);

app.listen(app.get('port'),()=>{
    console.log(`Aplicacion corriendo en el puerto ${app.get('port')}`);
    
})


// Middleware para verificar roles
function checkRole(role) {
    return (req, res, next) => {
        if (req.session.role === role) {
            return next();
        } else {
            return res.status(403).send('Acceso denegado');
        }
    };
}

// // Rutas protegidas por roles
// app.get('/admin', checkRole('DBA'), (req, res) => {
//     res.send('Área de administración');
// });

// app.get('/lectura', checkRole('solo_lectura'), (req, res) => {
//     res.send('Área de solo lectura');
// });

// app.get('/modificaciones', checkRole('modificaciones'), (req, res) => {
//     res.send('Área de modificaciones');
// });




// Ruta para la página de inicio de sesión
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Ruta para mostrar artículos
app.get('/articulos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'articulos.html'));
});

// Ruta para la interfaz de artículos
app.get('/interfaz-articulos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'interfaz-articulos.html'));
});




// Ruta para obtener todos los artículos
app.get('/api/articulos', (req, res) => {
    connection.query('SELECT * FROM Articulos', (error, results) => {
        if (error) {
            return res.status(500).send('Error al obtener artículos');
        }
        res.json(results); // Retorna los artículos en formato JSON
    });
});




