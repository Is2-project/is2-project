var ratingFocus;
function getUrl (){
  const queryString = window.location.search;     //take url
  const urlParams = new URLSearchParams(queryString);
  return urlParams;
}
function httpGetBook(isbn) {      //GET BOOK
  fetch('../api/books/' + isbn.toString())
  .then((resp) => resp.json())
  .then(function(data) {
      document.getElementById("tit").innerHTML= data.title;
      document.getElementById("other").innerHTML= data.author+", "+data.genre;
      return;
  })
  .catch( error => console.error(error) );
}

function httpGetReview(id) {    //GET REVIEWS
  fetch('../api/reviews/' + id.toString())
  .then((resp) => resp.json())
  .then(function(data) {
      setFocus(data.rating);
      document.getElementById("voto"+data.rating).checked = true;
      document.getElementById("recensione").value= data.description;
      return;
  })
  .catch( error => console.error(error) );
}

function buildPage() {    //FUCNTION THAT BUILD THE PAGE
  var urlParams = getUrl();
  const isbn = urlParams.get('isbn');
  const action = urlParams.get('action');
  const id = urlParams.get('id');
  document.getElementById("annulla").href = "/libro?isbn="+isbn;
  httpGetBook(isbn);
  if(action==="true") {
    document.getElementById("titlePage").innerHTML = "BooksReviews - Modifica Recensione"
    document.getElementById("modify").innerHTML = "Modifica recensione";
    document.getElementById("btn-end").innerHTML = "Modifica";
    httpGetReview(id);
  }
  else {
    document.getElementById("modify").innerHTML = "Aggiungi recensione";
  }

}

function setFocus(num) {      //SET FOCUS ON RATING
  for(var i = 1;i <=5;i++) {
    if(i!=num) {
      val = document.getElementById("lab"+i);
      val.classList.remove("focus");
      val.classList.remove("active");
    }
  }
  var val = document.getElementById("lab"+num);
  ratingFocus = document.getElementById("voto"+num).value;
  if(!val.classList.contains("focus")) {
    val.classList.toggle("focus");
    val.classList.toggle("active");
    document.getElementById("ratError").style= "display:none";
  }
}

function checkDescription(txt) {
  var val = document.getElementById(txt);
  if(val.value == "") {
    if(!val.classList.contains("is-invalid"))
      val.classList.toggle("is-invalid");
      val.classList.remove("is-valid");
    return false;
  }
  else {
    if(!val.classList.contains("is-valid"))
      val.classList.toggle("is-valid");
    val.classList.remove("is-invalid");
    return true;
  }
}

function checkRating(txt) {
  var val;
  for(var i = 1;i <=5;i++) {
    val = document.getElementById(txt+i);
    if(val.checked) {
      return true;
    }
  }
  //if(!document.getElementById("rat").classList.contains("is-invalid"))
    document.getElementById("ratError").style= "display:block";
  return false;
}

function formValidation() {
  if(checkDescription("recensione") && checkRating("voto")) {
    var urlParams = getUrl();     //take isbn from url
    const isbn = urlParams.get('isbn');
    const id = urlParams.get('id');
    const action = urlParams.get('action');
    let obj = {
      description: document.getElementById("recensione").value,
      rating: ratingFocus,
    };
    if(action!=="true") { //check if is an addition or a modification
      //POST REQUEST REVIEW
      fetch('../api/books/'+isbn+'/reviews', {      //POST FOR ADDICTION
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(obj),
      })
      .then((resp) => {
        if(resp.status == 201) {
          alert("Hai aggiunto una nuova recensione!");
          window.location.href = "/libro?isbn="+isbn;
        }
        else if(resp.status == 400){
          alert("Non puoi inserire questo voto!");
          window.location.href = "/libro?isbn="+isbn;
        }
        else if(resp.status == 401){
          alert("Devi accerede con un account prima di recensire un libro");
          window.location.href = "/signin";
        }
        else if(resp.status == 404){
          alert("Il libro che vuoi recensire non esiste!");
          window.location.href = "/";
        }
      })
      .catch(error => {console.error(error);});
    }
    else {
      fetch('../api/reviews/'+id, {     //PUT FOR MODIFICATION
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(obj),
      })
      .then((resp) => {
        if(resp.status == 200) {
          alert("Hai modificato la recensione!");
          window.location.href = "/libro?isbn="+isbn;
        }
        else if(resp.status == 400){
          alert("Non puoi inserire questo voto!");
          window.location.href = "/libro?isbn="+isbn;
        }
        else if(resp.status == 401){
          alert("Non puoi modificare la recensione di qualcun'altro oppure devi eseguire l'accesso!");
          window.location.href = "/libro?isbn="+isbn;
        }
        else if(resp.status == 404){
          alert("Recensione non esistente!");
          window.location.href = "/libro?isbn="+isbn;
        }
        else if(resp.status == 500){
          alert("Errore del database!");
          window.location.href = "/libro?isbn="+isbn;
        }
      })
      .catch(error => {console.error(error);});
    }
  }
}
buildPage();    //FUCNTION THAT BUILD THE PAGE
