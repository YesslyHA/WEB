const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'TU_USUARIO',
    password: 'TU_CONTRASEÑA',
    database: 'dulcetentacion'
});

// Registro de usuario
app.post('/registrar', (req, res) => {
    const { nombre, telefono } = req.body;
    db.query('INSERT INTO usuarios (nombre, telefono) VALUES (?, ?)',
        [nombre, telefono],
        (err) => {
            if (err) return res.json({ mensaje: 'Error al registrar usuario' });
            res.json({ mensaje: 'Usuario registrado con éxito' });
        }
    );
});

// Login y pedidos anteriores
app.post('/login', (req, res) => {
    const { nombre, telefono } = req.body;
    db.query('SELECT * FROM usuarios WHERE nombre = ? AND telefono = ?', 
        [nombre, telefono],
        (err, resultados) => {
            if (err || resultados.length === 0) return res.json({ mensaje: 'Usuario no encontrado' });

            const usuario = resultados[0];
            db.query('SELECT producto, precio, fecha FROM pedidos WHERE usuario_id = ? ORDER BY fecha DESC',
                [usuario.id],
                (err, pedidos) => {
                    if (err) return res.json({ mensaje: 'Error al obtener pedidos' });
                    res.json({ mensaje: 'Login exitoso', pedidos });
                }
            );
        }
    );
});

// Guardar pedido
app.post('/guardar-pedido', (req, res) => {
    const { nombre, telefono, productos } = req.body;
    db.query('SELECT id FROM usuarios WHERE nombre = ? AND telefono = ?', 
        [nombre, telefono],
        (err, resultados) => {
            if (err || resultados.length === 0) return res.json({ mensaje: 'Usuario no encontrado' });

            const usuario_id = resultados[0].id;
            const valores = productos.map(p => [usuario_id, p.product, p.price]);
            db.query('INSERT INTO pedidos (usuario_id, producto, precio) VALUES ?', 
                [valores],
                (err) => {
                    if (err) return res.json({ mensaje: 'Error al guardar pedido' });
                    res.json({ mensaje: 'Pedido guardado con éxito' });
                }
            );
        }
    );
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
