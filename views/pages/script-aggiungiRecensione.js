var ratingFocus;

function setFocus(num) {
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
    const queryString = window.location.search;     //take isbn from url
    const urlParams = new URLSearchParams(queryString);
    const isbn = urlParams.get('isbn');
    let obj = {
      description: document.getElementById("recensione").value,
      rating: ratingFocus,
    };
    //POST REQUEST REVIEW
    fetch('../api/books/'+isbn+'/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(obj),
    })
    .then((resp) => {
      if(resp.status == 201) {
        window.location.href = "/libro?isbn="+isbn;
        alert("Hai aggiunto una nuova recensione!");
      }
      else if(resp.status == 400){
        window.location.href = "/libro?isbn="+isbn;
        alert("Non puoi inserire questo voto!");
      }
      else if(resp.status == 401){
        window.location.href = "/signin";
        alert("Devi accerede con un account prima di recensire un libro");
      }
      else if(resp.status == 404){
        window.location.href = "/";
        alert("Il libro che vuoi recensire non esiste!");
      }
    })
    .catch(error => {console.error(error);});
  }
}
