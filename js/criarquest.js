var quantidadePergunta = 1;
$(document).ready(function(){

    $("#adicionar-btn").click(function(){
        console.log('Teste');

        quantidadePergunta++;

        const novaPergunta = `
        <form id="loginForm${quantidadePergunta}" class="loginForm">
        <h4 class="align-text">Pergunta ${quantidadePergunta}</h4>
        <input id="pergunta" placeholder="Pergunta" class="pergunta-div-dev" >
        <input id="Resposta1" placeholder="1º Resposta" class="attack-btn-dev" >
        <input id="Resposta2" placeholder="2º Resposta" class="attack-btn-dev" >
        <input id="Resposta3" placeholder="3º Resposta" class="attack-btn-dev" >
        <input id="Resposta4" placeholder="4º Resposta" class="attack-btn-dev" >
        </form>`;

        $(".pergunta-Container").append(novaPergunta);
        
    });
    

}); 

