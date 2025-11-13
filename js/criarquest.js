var quantidadePergunta = 1;
$(document).ready(function(){

    $("#adicionar-btn").click(function(){
        console.log('Teste');

        quantidadePergunta++;

        const novaPergunta = `
        <form id="loginForm${quantidadePergunta}" class="loginForm">
        <h4 class="align-text">Pergunta ${quantidadePergunta}</h4>
        <input type="text" placeholder="Pergunta" class="pergunta-div-dev" required>
        <input type="text" placeholder="1º Resposta" class="attack-btn-dev" required>
        <input type="text" placeholder="2º Resposta" class="attack-btn-dev" required>
        <input type="text" placeholder="3º Resposta" class="attack-btn-dev" required>
        <input type="text" placeholder="4º Resposta" class="attack-btn-dev" required>
        </form>`;

        $(".pergunta-Container").append(novaPergunta);
        
    });
    

}); 

