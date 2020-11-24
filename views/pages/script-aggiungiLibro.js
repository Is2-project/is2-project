function requiredItem (str, minLength, maxLength ) {
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
    genre: document.getElementById("genre").value
  };
  fetch('../api/books', { //POST request
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( obj ),
  })
  .then((resp) => { // nothing to do on the response
      return;
  })
  .catch( error => console.log(error) );


  window.location.href = "/";    //redirect on the main page
  alert("Hai aggiunto un nuovo libro!");
}

function formValidation () {  //function to validate the form
    checkISBN();
    if(requiredItem("isbn", 10, 13) && flag && requiredItem("title", 1, 50) && requiredItem("author", 1, 35) && checkYear() && requiredItem("genre", 1, 25)) {//&& requiredItem("title", 0, 120) && requiredItem("author", 0, 80) && requiredItem("genre", 0, 60) && checkYear("year"))
          onSub();
    }
}
