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

app.use('/img', express.static(path.join(__dirname, '../img')));

app.use('/css', express.static(path.join(__dirname, '../css')));

app.use('/js', express.static(path.join(__dirname, '../js')));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});



app.listen(8080, () => {
    console.log('Server esta escutando no porto 8080');
});
