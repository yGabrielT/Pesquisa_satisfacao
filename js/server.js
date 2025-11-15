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
con.promise()
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
    res.sendFile(path.join(__dirname, '../views/quest.html'));
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

app.get('/sql/EntrarSala', (req, res) => {
    const { senhaSala } = req.query;


    if (!senhaSala) {
        return res.status(400).json({ error: 'values are required' });
    }

    const query = 'SELECT id_questionario FROM questionarios WHERE senha_sala = (?)';

    con.query(query, [senhaSala], (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            return res.json({ ret: false, message: 'Sala não encontrada' });
        }
        return res.json({ ret: true, result: result });
    });

});

app.post('/sql/CriarSala', async (req, res) => {
    const { questionarioRaw, idUsuario, textoQuestionario, salaNumero } = req.body;

    if (!questionarioRaw || !idUsuario || !textoQuestionario || !salaNumero) {
        return res.status(400).json({ error: 'values are required' });
    }

    const questionario = JSON.parse(questionarioRaw);

    con.beginTransaction(async (err) => {
        if (err) return res.status(500).json({ error: err });

        try {

            // 1. Insere o questionário
            const [result1] = await con.promise().query(
                "INSERT INTO questionarios (texto_questionario, id_usuario, senha_sala) VALUES (?, ?, ?)",
                [textoQuestionario, idUsuario, salaNumero]
            );

            const idQuestionario = result1.insertId;

            // Prepara todas as queries numa lista
            const allQueries = [];

            // 2. Insere cada pergunta e suas respostas
            for (const q of questionario) {

                const [result2] = await con.promise().query(
                    "INSERT INTO perguntas (texto_pergunta, id_questionario) VALUES (?, ?)",
                    [q.pergunta, idQuestionario]
                );

                const idPergunta = result2.insertId;

                // adiciona todas as respostas na lista de Promises
                for (const resposta of q.respostas) {
                    allQueries.push(
                        con.promise().query(
                            "INSERT INTO respostas (id_pergunta, texto_resposta, quant_respondida) VALUES (?, ?, ?)",
                            [idPergunta, resposta, 0]
                        )
                    );
                }
            }

            // aguarda tudo terminar
            await Promise.all(allQueries);

            // 3. Finalizar transação
            await con.promise().commit();

            return res.json({ ret: true, idQuestionario });

        } catch (err) {

            await con.promise().rollback();
            return res.status(500).json({ error: err });
        }
    });
});



app.post('/sql/SalvarRespostas', (req, res) => {
    let { idsRespondidos } = req.body;

    if (!idsRespondidos) {
        return res.status(400).json({ error: 'values are required' });
    }

    // Se idsRespondidos veio como string (por causa do frontend)
    if (typeof idsRespondidos === "string") {
        idsRespondidos = JSON.parse(idsRespondidos);
    }

    con.beginTransaction(err => {
        if (err) return res.status(500).json({ error: err });

        let finalizados = 0; // contador

        idsRespondidos.forEach(id => {
            const query1 = `
                UPDATE respostas 
                SET quant_respondida = quant_respondida + 1 
                WHERE id_respostas = ?
            `;

            con.query(query1, [id], (err, result) => {

                if (err) {
                    return con.rollback(() => {
                        res.status(500).json({ error: err });
                    });
                }

                finalizados++;

                // Quando TODOS os updates tiverem terminado:
                if (finalizados === idsRespondidos.length) {
                    con.commit(err => {
                        if (err) {
                            return con.rollback(() => res.status(500).json({ error: err }));
                        }
                        return res.json({ ret: true });
                    });
                }
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

app.get('/sql/SelecionarResponderQuest', (req, res) => {
    const { idQuest } = req.query;


    if (!idQuest) {
        return res.status(400).json({ error: 'values are required' });
    }

    const query =
        `SELECT 
                    texto_pergunta,
                    texto_resposta,
                    texto_questionario,
                    respostas.id_respostas
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
                    texto_questionario,
                    senha_sala
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
