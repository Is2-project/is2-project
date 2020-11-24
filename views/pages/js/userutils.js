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
    }, (data) => {
        window.location.href = "/"; //Auth successful, redirect to homepage
    }).fail((res) => {
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
    }, (data) => {
        window.location.href = "/signin"; //Registration successful, redirect to login page
    }).fail((res) => {
        alert('Errore: ' + JSON.parse(response.responseText).error);
    });
}
