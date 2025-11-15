let questoesRepondidas = -1;

let dados = [];
let terminou = false;

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
        setAttackAnimation(0);
    });
    $("#btn-1").click(function () {
        setAttackAnimation(1);
    });
    $("#btn-2").click(function () {
        setAttackAnimation(2);
    });
    $("#btn-3").click(function () {
        setAttackAnimation(3);
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
    if (terminou) return;
    terminou = true;

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
    $("#victory-container").fadeIn(500);

}


function setAttackAnimation(idButton) {
    console.log("teste");
    var attackType = Math.floor(Math.random() * 4) + 1
    if (attackType == 1) {
        document.documentElement.style.setProperty('--sheet-w', '64px');
        document.documentElement.style.setProperty('--sheet-h', '88px');
        document.documentElement.style.setProperty('--sheet-steps', '11');
        document.documentElement.style.setProperty('--pixel-size', '6');
        document.documentElement.style.setProperty('--sheet-bottom', '-44vh');
        document.documentElement.style.setProperty('--sheet-right', '-2vh');

        $(".attack_sprite").attr("src", `/img/attacks/Dark-Bolt.png`);
    }

    if (attackType == 2) {
        document.documentElement.style.setProperty('--sheet-w', '32px');
        document.documentElement.style.setProperty('--sheet-h', '32px');
        document.documentElement.style.setProperty('--sheet-steps', '7');
        document.documentElement.style.setProperty('--pixel-size', '11');
        document.documentElement.style.setProperty('--sheet-bottom', '-39vh');
        document.documentElement.style.setProperty('--sheet-right', '-1vh');

        $(".attack_sprite").attr("src", `/img/attacks/spark.png`);
    }

    if (attackType == 3) {
        document.documentElement.style.setProperty('--sheet-w', '64px');
        document.documentElement.style.setProperty('--sheet-h', '128px');
        document.documentElement.style.setProperty('--sheet-steps', '10');
        document.documentElement.style.setProperty('--pixel-size', '6');
        document.documentElement.style.setProperty('--sheet-bottom', '-39vh');
        document.documentElement.style.setProperty('--sheet-right', '-1vh');

        $(".attack_sprite").attr("src", `/img/attacks/Lightning.png`);
    }
    if (attackType == 4) {
        document.documentElement.style.setProperty('--sheet-w', '64px');
        document.documentElement.style.setProperty('--sheet-h', '64px');
        document.documentElement.style.setProperty('--sheet-steps', '14');
        document.documentElement.style.setProperty('-pixel-size', '8');
        document.documentElement.style.setProperty('--sheet-bottom', '-45vh');
        document.documentElement.style.setProperty('--sheet-right', '-4vh');


        $(".attack_sprite").attr("src", `/img/attacks/Fire-Bomb.png`);
    }
    const sprite = document.querySelector('.attack_sprite');
    $(".attack").show();
    // remove para resetar
    sprite.classList.remove('run');

    // força o browser a reprocessar o estilo
    void sprite.offsetWidth;

    // adiciona de volta e anima uma vez
    sprite.classList.add('run');

    sprite.addEventListener('animationend', () => {
        console.log("Animação concluída!");
        AtualizarQuestoes(idButton);
    }, { once: true });
}