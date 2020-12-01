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

function updateInfo(email, password, nome, cognome, telefono) {
    console.log(email);
    console.log(password);
    console.log(nome);
    console.log(cognome);
    console.log(telefono);


    $.ajax({
      url: '/api/users/' + email,
      type: 'PUT',
      data: {
         password: password,
         name: nome,
         surname: cognome,
         phone: telefono
      },
      success: function(data) {
        alert('Load was performed.');
      }
    });
}
