const express = require('express');
const path = require('path');
var mysql = require('mysql2');

var queryresult;


const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: 'dbpesquisa'
});

con.connect(function(err) {
    if (err) throw err;
});
/*
con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM tbcliente", function (err, result, fields) 
    {
      if (err) throw err;
      console.log(result);
      queryresult = result;
    });
  });
*/
const app = express();

app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.use('/img', express.static(path.join(__dirname, '../img')));

app.use('/css', express.static(path.join(__dirname, '../css')));

app.use('/js', express.static(path.join(__dirname, '../js')));

app.get('/Quest', (req,res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/Registrar', (req,res) => {
    res.sendFile(path.join(__dirname, '../views/registrar.html'));
});

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

app.get('/CriarQuest', (req,res) => {
    res.sendFile(path.join(__dirname, '../views/criarQuest.html'));
});

app.get('/sql/RegistrarUsu', (req,res) => {
  const { nome, email, senha} = req.query;
  

  if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'values are required' });
  }

  const query = 'INSERT INTO usuarios (nome, email, senha) VALUE (?,?,?)';
  
  con.query(query, [nome, email, senha], (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(result);
  });
  
}); 




app.get('/sql/LoginUsu', (req,res) => {
  const { nome, email, senha} = req.query;
  

  if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'values are required' });
  }

  const query = 'INSERT INTO usuarios (nome, email, senha) VALUE (?,?,?)';
  
  con.query(query, [nome, email, senha], (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(result);
  });
  
}); 

app.get('/sql/CriarSala', (req,res) => {
  const { nome, email, senha} = req.query;
  

  if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'values are required' });
  }

  const query = 'INSERT INTO usuarios (nome, email, senha) VALUE (?,?,?)';
  
  con.query(query, [nome, email, senha], (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(result);
  });
  
}); 


app.get('/sql/VerificarSala', (req,res) => {
  const { nome, email, senha} = req.query;
  

  if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'values are required' });
  }

  const query = 'INSERT INTO usuarios (nome, email, senha) VALUE (?,?,?)';
  
  con.query(query, [nome, email, senha], (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(result);
  });
  
}); 

app.get('/sql/VerificarSala', (req,res) => {
  const { nome, email, senha} = req.query;
  

  if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'values are required' });
  }

  const query = 'INSERT INTO usuarios (nome, email, senha) VALUE (?,?,?)';
  
  con.query(query, [nome, email, senha], (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(result);
  });
  
}); 


app.listen(8080, () => {
    console.log('Server esta escutando no porto 8080');
});
