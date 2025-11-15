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

con.connect(function (err) {
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

app.use(express.static(path.join(__dirname, '../')));
app.use(express.json());

app.use('/img', express.static(path.join(__dirname, '../img')));

app.use('/css', express.static(path.join(__dirname, '../css')));

app.use('/js', express.static(path.join(__dirname, '../js')));

app.get('/Quest', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/Registrar', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/registrar.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

app.get('/CriarQuest', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/criarQuest.html'));
});
app.get('/SelecionarQuest', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/selecionarQuest.html'));
});
app.get('/AnaliseQuest', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/analiseQuest.html'));
});

app.get('/sql/RegistrarUsu', (req, res) => {
    const { nome, email, senha } = req.query;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'values are required' });
    }

    const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';

    con.query(query, [nome, email, senha], (err, result) => {
        if (err) throw err;
        res.json({ success: true, result });
    });
});




app.get('/sql/LoginUsu', (req, res) => {
    const { email, senha } = req.query;


    if (!email || !senha) {
        return res.status(400).json({ error: 'values are required' });
    }

    const query = 'SELECT nome, id_usuario FROM usuarios WHERE email = (?) and senha = (?)';

    con.query(query, [email, senha], (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            return res.json({ ret: false, message: 'Usuário não encontrado' });
        }
        return res.json({ ret: true, result: result });
    });

});

app.post('/sql/CriarSala', (req, res) => {
    const { questionarioRaw, idUsuario, textoQuestionario, salaNumero } = req.body;
    
    if (!questionarioRaw || !idUsuario || !textoQuestionario || !salaNumero) {
        return res.status(400).json({ error: 'values are required' });
    }
    
    const questionario = JSON.parse(questionarioRaw);

    questionario.forEach(q=>{
        console.log(q)
        q.respostas.forEach(r=>{
            console.log(r);
        })
    })
    con.beginTransaction(err => {
        if (err) return res.status(500).json({ error: err });

        const query1 = 'INSERT INTO questionarios (texto_questionario, id_usuario, senha_sala) VALUES (?, ?, ?)';
        con.query(query1, [textoQuestionario, idUsuario, salaNumero], (err, result1) => {
            if (err) {
                return con.rollback(() => res.status(500).json({ error: err }));
            }
            questionario.forEach(q => {
                const query2 = 'INSERT INTO perguntas (texto_pergunta, id_questionario) VALUES (?, ?)';
                con.query(query2, [q.pergunta, result1.insertId], (err, result2) => {
                    if (err) {
                        return con.rollback(() => res.status(500).json({ error: err }));
                    }

                    q.respostas.forEach(r => {
                        const query3 = 'INSERT INTO respostas (id_pergunta, texto_resposta, quant_respondida) VALUES (?, ?, ?)';
                        con.query(query3, [result2.insertId, r, 0], (err, result3) => {
                            if (err) {
                                return con.rollback(() => res.status(500).json({ error: err }));
                            }

                        });

                    });


                });
                
            });

            con.commit(err => {
                if (err) {
                    return con.rollback(() => res.status(500).json({ error: err }));
                }

                res.json({
                    idQuest: result1,
                    ret: true
                });
            });
        });
    });
});




app.get('/sql/SelecionarQuest', (req, res) => {
    const { idUsuario } = req.query;


    if (!idUsuario) {
        return res.status(400).json({ error: 'values are required' });
    }

    const query = `SELECT
                    questionarios.id_questionario,questionarios.texto_questionario 
                FROM questionarios 
                INNER JOIN usuarios ON usuarios.id_usuario = questionarios.id_usuario
                WHERE usuarios.id_usuario = (?)`;

    con.query(query, [idUsuario], (err, result) => {
        if (err) throw err;
        console.log(result);
        if (result.length === 0) {
            return res.json({ ret: false, message: 'Usuário não encontrado' });
        }
        return res.json({ ret: true, result: result });
    });

});


app.get('/sql/SelecionarAnaliseQuest', (req, res) => {
    const { idQuest } = req.query;


    if (!idQuest) {
        return res.status(400).json({ error: 'values are required' });
    }

    const query = 
                `SELECT 
                    texto_pergunta,
                    texto_resposta,
                    quant_respondida,
                    texto_questionario
                FROM respostas 
                INNER JOIN perguntas ON respostas.id_pergunta = perguntas.id_pergunta
                INNER JOIN questionarios ON perguntas.id_questionario = questionarios.id_questionario
                WHERE questionarios.id_questionario = (?)`;

    con.query(query, [idQuest], (err, result) => {
        if (err) throw err;
        console.log(result);
        if (result.length === 0) {
            return res.json({ ret: false, message: 'Usuário não encontrado' });
        }
        return res.json({ ret: true, result: result });
    });

});

app.listen(8080, () => {
    console.log('Server esta escutando no porto 8080');
});
