var quantidadePergunta = 1;
$(document).ready(function(){

    $("#adicionar-btn").click(function(){
        console.log('Teste');

        quantidadePergunta++;

        const novaPergunta = `
            <div id="loginForm${quantidadePergunta}" class="loginForm">
                <h4 class="align-text">Pergunta ${quantidadePergunta}</h4>
                <input placeholder="Pergunta" class="pergunta pergunta-div-dev" required>
                <input placeholder="1º Resposta" class="resposta1 attack-btn-dev" required>
                <input placeholder="2º Resposta" class="resposta2 attack-btn-dev" required>
                <input placeholder="3º Resposta" class="resposta3 attack-btn-dev" required>
                <input placeholder="4º Resposta" class="resposta4 attack-btn-dev" required>
            </div>`;


        $(".pergunta-Container").append(novaPergunta);
        
    });
    

}); 

$(".menu-login").on("submit", function(e) {
    e.preventDefault(); 
    let dados = pegarDados();  // pegar todas as perguntas e respostas
    console.log(gerarCodigo());
    console.log("Dados para enviar:", dados);
    enviarDados(dados);
});

function pegarDados() {
    const questionarios = [];

    $(".loginForm").each(function() {   // percorre loginForm1, loginForm2...
        
        let pergunta = $(this).find(".pergunta").val();
        let resp1 = $(this).find(".resposta1").val();
        let resp2 = $(this).find(".resposta2").val();
        let resp3 = $(this).find(".resposta3").val();
        let resp4 = $(this).find(".resposta4").val();

        questionarios.push({
            pergunta: pergunta,
            respostas: [resp1, resp2, resp3, resp4]
        });

    });

    return questionarios;
}

function enviarDados(dados){
    var idUsuario = localStorage.getItem('idUsuario');  
    var textoQuestionario = $('#nome-quest').val();
    var salaNumero = gerarCodigo()
    /*
    $.post('/sql/CriarSala', { questionarios: dados, idUsuario: idUsuario, textoQuestionario:  textoQuestionario, salaNumero: salaNumero}, function(data) {

            if (data.ret === true) {
                console.log('Login Válido!', data.result[0].nome, data.result[0].id_usuario);
                localStorage.setItem('idUsuario',data.result[0].id_usuario);    
                location.href = '/';
            } else {
                console.log('Login Inválido', data.message);
            }

        }, 'json');
    */
    $.ajax({
        url: "/sql/CriarSala",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            questionarioRaw: JSON.stringify(dados),
            idUsuario: idUsuario,
            textoQuestionario: textoQuestionario,
            salaNumero: salaNumero
        }),
        success: function(res){
            console.log("Criado:", res);
        }
    });

}


function gerarCodigo() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';

    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        codigo += chars[randomIndex];
    }

    return codigo;
}
