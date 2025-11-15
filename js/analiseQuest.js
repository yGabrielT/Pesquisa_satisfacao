var idQuest = localStorage.getItem('questAnaliseID')

$.get('/sql/SelecionarAnaliseQuest', { idQuest: idQuest }, function (data) {

    console.log(data.result);
    let questionarios = {};
    

    data.result.forEach(item => {
        const pergunta = item.texto_pergunta;

        // Se ainda não existe a pergunta, cria o array
        if (!questionarios[pergunta]) {
            questionarios[pergunta] = [];
        }
        var text = item.texto_resposta
        var quant = item.quant_respondida
        let quest = {
            texto_resposta: text,
            quant_respondida: quant
        }
        // Adiciona a resposta no array da pergunta correspondente
        questionarios[pergunta].push(quest);
    });

    // Converter o objeto em array no formato desejado
    let listaFormatada = Object.keys(questionarios).map(pergunta => ({
        pergunta: pergunta,
        respostas: questionarios[pergunta]
    }));

    console.log(data.result[0].texto_questionario);
    gerarHTML(listaFormatada);
    $("#titulo-login").text(data.result[0].texto_questionario);



}, 'json');



// questionarios = lista formatada do agrupamento
// exemplo: [
//   { pergunta: "Pergunta A", respostas: [ {resposta:'A', quantidade:1}, ... ] }
// ]

function gerarHTML(questionarios) {
    const container = $("#AnaliseContainer");

    container.empty(); // limpa antes de preencher

    questionarios.forEach((q, i) => {

        let bloco = `
        <div id="AnaliseForm" class="loginFormAnalise">
            <h4 class="align-text">Pergunta ${i+1}</h4>
            <a class="pergunta pergunta-div-dev">${q.pergunta}</a>
        `;

        q.respostas.forEach((resp, index) => {
            console.log(resp);
            bloco += `
            <div class="analiseRes">
                <a class="attack-btn-dev analiseResIn">${resp.texto_resposta}</a>
                <a class="attack-btn-dev analiseResIn">${resp.quant_respondida} Resposta(s)</a>
            </div>
            `;
        });

        bloco += `</div>`;

        container.append(bloco);
    });
}
