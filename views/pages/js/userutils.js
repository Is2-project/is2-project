/*
    Utilities per la gestione degli utenti
*/

function logout() {
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    window.location.href = "/";
}

function auth(email, password) {
    //Chiama /api/login con username e password
    $.post('/api/login', {
           email: email,
           password: password
    }, function(data) {
        window.location.href = "/"; //Auth successful, redirect to homepage
    })
    .fail(function(response) {
        alert('Errore: ' + JSON.parse(response.responseText).error);
    });
}

function register(email, password, nome, cognome, telefono) {
    //Chiama /api/users con tutti i dati necessari
    $.post('/api/users', {
           email: email,
           password: password,
           name: nome,
           surname: cognome,
           phone: telefono
    }, function(data) {
        window.location.href = "/signin"; //Registration successful, redirect to login page
    })
    .fail(function(response) {
        alert('Errore: ' + JSON.parse(response.responseText).error);
    });
}
