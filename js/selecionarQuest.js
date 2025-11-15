$(document).on("click", ".questItem", function(e){
    e.preventDefault();

    var id = $(this).find(".questSelectable")[0].id.replace("questId", "");
    localStorage.setItem('questAnaliseID', id);
    location.href = "/AnaliseQuest"
});

const idUsuario = localStorage.getItem('idUsuario');

if (idUsuario) {

    $.get('/sql/SelecionarQuest', { idUsuario: idUsuario}, function(data) {
        console.log(data);
        if (data.ret == true){
            for (let index = 0; index < data.result.length; index++) {
                const element = data.result[index];
                const novaPergunta = 
                `
                <div class="questItem">
                    <img id = "questId${element.id_questionario}" class="questSelectable point-filter" src="/img/borders/23.png">
                    <p class="questText">${element.texto_questionario}</p>
                </div>
                `;
                $(".questContainer").append(novaPergunta);
                
            }
        }
        else{
            alert(data.message)
        }



    }, 'json');

} else {
    alert('Usuário não foi logado.');
}

