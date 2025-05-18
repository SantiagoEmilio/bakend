const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678', // ← Cambia esto si tenés una contraseña
  database: 'recuperacion'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
  } else {
    console.log('Conectado a MySQL ✔️');
  }
});

// 👉 POST - Registrar datos del formulario
app.post('/registrar', (req, res) => {
  const { nombre, correo, mensaje } = req.body;

  const sql = 'INSERT INTO usuarios (nombre, correo, mensaje) VALUES (?, ?, ?)';
  db.query(sql, [nombre, correo, mensaje], (err, result) => {
    if (err) {
      console.error('Error al insertar:', err);
      res.status(500).json({ error: 'Error al registrar usuario' });
    } else {
      res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
    }
  });
});

// 👉 GET - Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      res.status(500).json({ error: 'Error al obtener datos' });
    } else {
      res.json(results);
    }
  });
});

// 👉 DELETE - Eliminar usuario por ID
app.delete('/eliminar/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM usuarios WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar:', err);
      res.status(500).json({ error: 'Error al eliminar usuario' });
    } else {
      res.json({ mensaje: 'Usuario eliminado correctamente' });
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
