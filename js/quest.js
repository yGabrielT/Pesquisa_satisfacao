let questoesRepondidas = -1;

let dados = [];

const respostas = [];
$(document).ready(function () {
    const idQuest = localStorage.getItem('idSala');
    console.log("ID no front:", idQuest);


    //var dados = GetDados(idQuest);
    GetDados(idQuest).then(res => {
        console.log("Resultado final:", res);
        dados = res;
        console.log(dados[0])
        IniciarQuestoes();
    });


});

function GetDados(idQuest) {
    return new Promise((resolve, reject) => {
        $.get('/sql/SelecionarResponderQuest', { idQuest: idQuest }, function (data) {

            let questionarios = {};


            data.result.forEach(item => {
                const pergunta = item.texto_pergunta;

                // Se ainda não existe a pergunta, cria o array
                if (!questionarios[pergunta]) {
                    questionarios[pergunta] = [];
                }
                var text = item.texto_resposta
                // Adiciona a resposta no array da pergunta correspondente
                var text = item.texto_resposta
                var idResposta = item.id_respostas;
                let quest = {
                    texto_resposta: text,
                    foiRespondido: false,
                    idResposta: idResposta
                }
                questionarios[pergunta].push(quest);
            });

            // Converter o objeto em array no formato desejado
            let listaFormatada = Object.keys(questionarios).map(pergunta => ({
                pergunta: pergunta,
                respostas: questionarios[pergunta]
            }));
            resolve(listaFormatada);

        }, 'json').fail(reject);
    });
};


function IniciarQuestoes() {
    AtualizarQuestoes(null);
    $("#btn-0").click(function () {
        AtualizarQuestoes(0);
    });
    $("#btn-1").click(function () {
        AtualizarQuestoes(1);
    });
    $("#btn-2").click(function () {
        AtualizarQuestoes(2);
    });
    $("#btn-3").click(function () {
        AtualizarQuestoes(3);
    });


}

function AtualizarQuestoes(respID) {
    if (respID != null && questoesRepondidas <= dados.length - 1) {
        dados[questoesRepondidas].respostas[respID].foiRespondido = true;
        console.log(dados)
    }
    questoesRepondidas++;
    if (questoesRepondidas >= dados.length) {
        console.log('Todas questões respondidas');
        finalizarQuestoes();
        return;
    }
    var iconId = Math.floor(Math.random() * 48) + 1
    $('#enemy_img').attr("src", `/img/enemies/enemies_all/Icon${iconId}.png`);
    $(".pergunta-div").text(dados[questoesRepondidas].pergunta)


    for (let i = 0; i < dados[questoesRepondidas].respostas.length; i++) {
        $("#btn-" + i).text(dados[questoesRepondidas].respostas[i].texto_resposta);
    }

}

function finalizarQuestoes() {

    let idsRespondidos = [];
    dados.forEach(q => {
        q.respostas.forEach(r => {
            if (r.foiRespondido === true) {
                idsRespondidos.push(r.idResposta);
            }
        });
    });
    console.log(idsRespondidos);

    $.ajax({
        url: "/sql/SalvarRespostas",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            idsRespondidos: JSON.stringify(idsRespondidos),
        }),
        success: function (res) {
            console.log("Criado:", res);
        }
    });

}