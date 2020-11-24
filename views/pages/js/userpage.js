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
