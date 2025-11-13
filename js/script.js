let questoesRepondidas = -1;
let quantRespostasLayout = 4;
const perguntas = [
    "Pergunta1",
    "Pergunta2",
    "Pergunta3",
    "Pergunta4"
];
const questoes = [
    "Questao1",
    "Questao2",
    "Questao3",
    "Questao4",
    "Questao5",
    "Questao6",
    "Questao7",
    "Questao8",
    "Questao9",
    "Questao10",
    "Questao11",
    "Questao12",
    "Questao13",
    "Questao14",
    "Questao15",
    "Questao16"
];

const respostas = []; 
$(document).ready(function(){

    IniciarQuestoes();
}); 


function IniciarQuestoes(){
    AtualizarQuestoes();
      $("#btn-0").click(function(){
        AtualizarQuestoes();
    });
    $("#btn-1").click(function(){
        AtualizarQuestoes();
    });
    $("#btn-2").click(function(){
        AtualizarQuestoes();
    });
    $("#btn-3").click(function(){
        AtualizarQuestoes();
    });


}

function AtualizarQuestoes(){

    

    questoesRepondidas++;
    if (questoesRepondidas >= perguntas.length){
        console.log('Todas questões respondidas');
        return;
    }
    var iconId = Math.floor(Math.random() * 48) + 1
    $('#enemy_img').attr("src", `/img/enemies/enemies_all/Icon${iconId}.png`);
    $(".pergunta-div").text(perguntas[questoesRepondidas])
    let questoesRepondidasCount = (questoesRepondidas * quantRespostasLayout);
    let questoesParaResponder = (questoesRepondidasCount + quantRespostasLayout)
    let indexBtn = 0
    for (let i = questoesRepondidasCount; i < questoesParaResponder; i++) {
        $("#btn-" + indexBtn).text(questoes[i]);
        indexBtn++;
    }
}