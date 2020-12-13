function requiredItem (str, minLength, maxLength ) {
    var format = /[`@#$%^*()_+\-=\[\]{}\\|<>\/~]/;
    val = document.getElementById(str);
    if(val.value === "") {// check is value is empty, if yes return false and set the class visible effect to the html
        document.getElementById(str+"Error").innerHTML = "Campo obbligatorio!";
        if(!val.classList.contains("is-invalid"))                 //check is the div has already invalid class if not, I add it
          val.classList.toggle("is-invalid");
        val.classList.remove("is-valid");
        return false;
    }
    else {
        if(val.value.length < minLength) {              //check min lenght param
            document.getElementById(str+"Error").innerHTML = "Lunghezza minima: "+minLength+"!";
            if(!val.classList.contains("is-invalid")) // same thing as above
              val.classList.toggle("is-invalid");
            val.classList.remove("is-valid");
            return false;
        } else if(maxLength !== 0 && val.value.length > maxLength) {  //check min lenght param
            document.getElementById(str+"Error").innerHTML ="Lunghezza massima: "+maxLength+"!";
            if(!val.classList.contains("is-invalid"))
              val.classList.toggle("is-invalid");
            val.classList.remove("is-valid");
            return false;
        } else if(format.test(val.value)){
          document.getElementById(str+"Error").innerHTML ="il campo non puó contenere caratteri speciali!";
          if(!val.classList.contains("is-invalid"))
            val.classList.toggle("is-invalid");
          val.classList.remove("is-valid");
          return false;
        } else {  // if it all good we can valid the field
          if(!val.classList.contains("is-valid"))
            val.classList.toggle("is-valid");
          val.classList.remove("is-invalid");
          return true;
        }
    }
}

function checkYear() {      //same function for book's year
  var id= document.getElementById("year");
  var val= document.getElementById("year").value;
  if(!isNaN(val) && val > 0 && val < 2021) {
    if(!id.classList.contains("is-valid"))
      id.classList.toggle("is-valid");
    id.classList.remove("is-invalid");
    return true;
  } else {
    if(!id.classList.contains("is-invalid"))
      id.classList.toggle("is-invalid");
    id.classList.remove("is-valid");
    return false;
  }
}

var flag; // flag for check if the isbn is alreay used; FALSE if it used, TRUE if don't.
function checkISBN () {
  if(requiredItem("isbn", 10, 13)) {
    var txt = document.getElementById("isbn").value;
    fetch('../api/books/' + txt.toString()) // GET request
    .then((resp) => resp.json())
    .then(data => {
      if(data.error === undefined) {   //if there is the isbn in the system the param error of data is undefined, then we set up the class is-invalid to inform the user that this book is already in the system
        document.getElementById("isbnError").innerHTML = "Questo libro é giá presente nel sistema!";
        if(!document.getElementById("isbn").classList.contains("is-invalid"))
          document.getElementById("isbn").classList.toggle("is-invalid");
        document.getElementById("isbn").classList.remove("is-valid");
        flag = false;
      }
      else {
        flag = true;  // if there isn't the isbn in the system, the get response set the param error as not undefined, then we set flag true.
      }
    })
    .catch( (error) =>  { console.error(error) });
  }
  else {
    flag = false;
  }
}
//POST REQUEST
function onSub() {      //function use when we submit the form
  let obj = {     //set up the object for the post request
    isbn: document.getElementById("isbn").value,
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    year: document.getElementById("year").value,
    genre: document.getElementById("genre").value.toLowerCase()
  };
  fetch('../api/books', { //POST request
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify(obj),
  })
  .then((resp) => {
      if(resp.status == 401) {        //check if the user is logged, if not redirect to login page
        alert("Devi accedere con un account prima di inserire un libro");
        window.location.href = "/signin";
      }
      else if(resp.status == 201){
        alert("Hai aggiunto un nuovo libro!");
        window.location.href = "/";
      }
      else if(resp.status == 400) {
        alert("Errori di paramentri!");
        window.location.href = "/";
      }
      else if(resp.status == 500) {
        alert("Database error!");
        window.location.href = "/";
      }
      return;
  })
  .catch( error => {console.error(error); });
}

function formValidation () {  //function to validate the form
    checkISBN();
    if(requiredItem("isbn", 10, 13) && flag && requiredItem("title", 1, 50) && requiredItem("author", 1, 35) && checkYear() && requiredItem("genre", 1, 25)) {//&& requiredItem("title", 0, 120) && requiredItem("author", 0, 80) && requiredItem("genre", 0, 60) && checkYear("year"))
          onSub();
    }
}

document.onkeydown = function(e){
 if(e.keyCode == 13){
   formValidation ();
 }
};
