$('#entrarCriarQuest-form').on('submit', function(e) {
    e.preventDefault();

    const email = $('#emailCriarQuest').val();
    const senha = $('#senhaCriarQuest').val();

    if (email && senha) {

        $.get('/sql/LoginUsu', { email: email, senha: senha }, function(data) {

            if (data.ret === true) {
                console.log('Login Válido!', data.result[0].nome, data.result[0].id_usuario);
                localStorage.setItem('idUsuario',data.result[0].id_usuario);    
                location.href = '/SelecionarQuest';
            } else {
                console.log('Login Inválido', data.message);
            }

        }, 'json');

    } else {
        alert('Por favor, preencha todos os campos.');
    }
});

$('#entrarQuest-form').on('submit', function(e) {
    e.preventDefault();

    const senhaSala = $('#SenhaSala').val();

    if (senhaSala) {

        $.get('/sql/EntrarSala', { senhaSala: senhaSala}, function(data) {

            if (data.ret === true) {
                console.log('Sala Válida!', data.result[0].id_questionario);
                localStorage.setItem('idSala',data.result[0].id_questionario);    
                location.href = '/Quest';
            } else {
                console.log('Sala Inválida', data.message);
            }

        }, 'json');

    } else {
        alert('Por favor, preencha todos os campos.');
    }
});