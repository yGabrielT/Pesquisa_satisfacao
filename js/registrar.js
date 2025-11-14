
$(document).ready(function(){
    
    $("#registrar-btn").click(function(){
        let nome = $("#nome").val();
        let email = $("#email").val();
        let password = $("#password").val();

        console.log(nome,encodeURIComponent(email),password);

         fetch(`/sql/RegistrarUsu?nome=${nome}&email=${email}&senha=${password}`)
            .then(res => res.json())
            .then(data => console.log(data));

    });
});




