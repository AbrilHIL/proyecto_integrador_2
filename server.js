const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configura tu conexión MySQL con los datos de Workbench
const db = mysql.createConnection({
  host: '192.168.56.1', // o la IP de tu servidor MySQL
  user: 'root', // tu usuario de MySQL
  password: '123456', // tu contraseña de MySQL
  database: 'new_schema' // el nombre de tu base de datos
});

// Ruta para registrar usuario
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  // Verifica si el email ya existe
  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0) {
        // Ya existe una cuenta con ese email
        return res.status(409).json({ success: false, message: 'El correo electrónico ya está registrado' });
      }
      // Si no existe, crea el usuario
      db.query(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        [name, email, password],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true, userId: result.insertId });
        }
      );
    }
  );
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Intento de login:', email, password);
  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (err, results) => {
      if (err) {
        console.error('Error MySQL:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log('Resultados:', results);
      if (results.length === 0) {
        // No existe el usuario con ese email
        return res.status(401).json({ success: false, message: 'Incorrect email or password' });
      }

      // Usuario y contraseña correctos
      res.json({ success: true, user: results[0] });
    }
  );
});

app.listen(3000, () => console.log('API corriendo en puerto 3000'));
