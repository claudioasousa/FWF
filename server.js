
/**
 * SERVIDOR BRIDGE (BACKEND)
 * Para rodar: 
 * 1. Instale o Node.js
 * 2. npm install express mysql2 cors
 * 3. node server.js
 */

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO DO BANCO DE DADOS SOLICITADA
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'qwe123',
  database: 'gestao_cursos'
});

db.connect(err => {
  if (err) {
    console.error('ERRO AO CONECTAR NO SQL:', err);
    return;
  }
  console.log('CONECTADO AO SQL EM 127.0.0.1');
});

// EXEMPLO DE ROTAS (Repetir para teachers, courses, etc)
app.get('/students', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/students', (req, res) => {
  const s = req.body;
  const sql = 'INSERT INTO students (name, cpf, contact, birthDate, address, courseId, status, class) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [s.name, s.cpf, s.contact, s.birthDate, s.address, s.courseId, s.status, s.class], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ id: results.insertId, ...s });
  });
});

// ROTAS SIMILARES PARA OUTRAS ENTIDADES...
app.get('/teachers', (req, res) => { db.query('SELECT * FROM teachers', (err, r) => res.json(r)); });
app.get('/courses', (req, res) => { db.query('SELECT * FROM courses', (err, r) => res.json(r)); });
app.get('/partners', (req, res) => { db.query('SELECT * FROM partners', (err, r) => res.json(r)); });
app.get('/users', (req, res) => { db.query('SELECT * FROM users', (err, r) => res.json(r)); });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API Bridge rodando em http://localhost:${PORT}`);
});
