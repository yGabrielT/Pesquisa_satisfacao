

$('#login-Form').on('submit', function(e) {
    e.preventDefault();

    const nome = $('#nome').val();
    const email = $('#email').val();
    const senha = $('#senha').val();

    if (nome && email && senha) {

        $.get('/sql/RegistrarUsu', { nome: nome, email: email, senha: senha }, function(data) {
            console.log(data);
            $('.menu-login').append('<a class="sucessText">Conta criada!</a>')
        }, 'json');

    } else {
        alert('Por favor, preencha todos os campos.');
    }
});
