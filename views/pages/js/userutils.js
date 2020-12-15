/*
    Utilities per la gestione degli utenti
*/

function logout() {
    Cookies.remove('token');
    window.location.href = "/";
}

function auth(email, password) {
    //Chiama /api/login con username e password
    $.post('/api/login', {
        email: email,
        password: password
    }, (data) => {
        Cookies.set('token', data.token);
        window.location.href = document.referrer ?? '/';    
    }).fail((res) => {
        alert('Errore: ' + JSON.parse(res.responseText).error);
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
        alert('Errore: ' + JSON.parse(res.responseText).error);
    });
}

function updateInfo(email, password, nome, cognome, telefono) {

    $.ajax({
      url: '/api/users/' + userId(),
      type: 'PUT',
      data: {
         password: password,
         name: nome,
         surname: cognome,
         phone: telefono
      },
      headers: { 'Authorization': 'Bearer ' + getToken() },
      success: function(data) {
        //alert('Load was performed.');
        window.location.href = '/';
      }
    }).fail((res) => {
        alert('Errore: ' + JSON.parse(res.responseText).error);
    });
}

function userId() {
    /* Returns the id of the current logged user. If not logged returns false. */
    if (Cookies.get('token')) {        
        if (Date.now() / 1000 < jwt_decode(Cookies.get('token')).exp) {
            //Token not expired
            return jwt_decode(Cookies.get('token')).id;
        } else {
            //Token expired
            Cookies.remove('token');
            return false;
        } 
    }
    //Token not present
    return false;
}

function userById(id) {
    var d;
    $.ajax({
        url: '/api/users/' + id,
        type: 'GET',
        headers: { 'Authorization': 'Bearer ' + getToken() },
        success: (data) => { d = data; },
        async: false
    }).fail((res) => {
        alert('Errore: ' + JSON.parse(res.responseText).error);
    });
    return d;
}

var userObj;
function user() {
    return userObj ?? (userObj = userById(userId()));
}

function getToken() {
    return Cookies.get('token');
}
