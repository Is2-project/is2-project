

function deleteRew(id) {
  fetch('../api/reviews/' + id.toString())
  .then((resp) => resp.json())
  .then(function(data) {
      return;
  })
  .catch( error => console.error(error) );
}

function loadUser(data) {         //load name user on the reviews
  var nickName = '';
  if(data!==undefined) {
    nickName=data.name+' '+data.surname;
    var ul = document.getElementsByName('td'+data.id);      //get the reviews that an user has written
    for (var i = 0; i < ul.length; i++) {
        ul[i].innerHTML = nickName;                 //set the name
    }
  }
  else {
    nickName='ERROR';
  }
}
function createStars(rating) {
  var txt = "";
  for(var i=1;i<=5;i++) { //stampo le stelline
    txt+= '<span class="star ';
    if(i <= rating)
      txt+= 'on"></span>';
    else if((i-rating) < 1)
      txt+= 'half"></span>';
    else
      txt+= '"></span>';
  }
  return txt;
}
function loadReviews(data) {
  const ul = document.getElementById('tbody');      //set up the page with the reviews
  var txt = '';
  if(data[0] !== undefined) {
    for(let rew of data) {
      //httpGetUser(rew.user);
      txt+= '<tr>';
      txt+= '<td name= td'+rew.user+'>'+rew.user+'</td>'; httpGetUserName(rew.user);        // now we stamp the id of user we have a p[roblem to syncronize the fun that take the name of user
      txt+= '<td>';
      txt+= createStars(rew.rating);
      txt+='</td>';
      txt+= '<td>'+rew.description+'</td>';
      if(rew.user) {
        document.getElementById("opt").style.removeProperty("display");
        txt+= "<td> <a href='#' onclick='deleteRew("+rew.id+")' style='background-color: rgb(200,0,0); 'class='btn btn-primary a-btn-slide-text'> <span class='glyphicon glyphicon-remove' aria-hidden='true'></span><span><strong>X</strong></span></a></td>"
      }
      txt+= '</tr>';

    }
  }
  else {
    txt+='<tr colspan = 3>';
    txt+= '<td>Non ci sono recensioni per questo libro!</td>';
  }
  ul.innerHTML = txt;
}

function loadBooks(data) {
    const ul = document.getElementById('book');
    var txt = '';
    txt+= '<h1>'+data.title+'</h1>'; document.title = "BooksReviews "+data.title; //titol of the page
    txt+= '<h6> Author: '+data.author+'</h6>';
    txt+= '<h6> Genre: '+data.genre+'</h6>';
    txt+= '<h6> Year: '+data.year+'</h6>';
    txt+= '<h6> Rating: ';
    txt+= createStars(data.rating);
    txt+='</h6>';
    txt+= '<h6> Isbn: '+data.isbn+'</h6>';
    ul.innerHTML = txt; // text html that we insert
}

function httpGetUserName (user) {         // commetto per vedere cosa chiedo
    fetch('../api/users/' + user.toString())
    .then((resp) => resp.json())
    .then(function(data) {
        loadUser(data);
        return;
    })
    .catch( error => console.error(error) );
}
function httpGetBook (isbn) {  //get the arg of the book and build the part of book present
  console.log(isbn);            // commetto per vedere cosa chiedo
    fetch('../api/books/' + isbn.toString())
    .then((resp) => resp.json())
    .then(function(data) {
        loadBooks(data);
        return;
    })
    .catch( error => console.error(error) );
}

function httpGetReviews (isbn) {  // get the reviews of the book and build the table
  console.log(isbn);            // commetto per vedere cosa chiedo
    fetch('../api/books/'+ isbn.toString()+'/reviews')
    .then((resp) => resp.json())
    .then(function(data) {
        loadReviews(data);
        return;
    })
    .catch( error => console.error(error) );
}

function buildPage () { // fun that biuld page
  const queryString = window.location.search;     //take isbn from url
  const urlParams = new URLSearchParams(queryString);
  const isbn = urlParams.get('isbn');
  document.getElementById("addReview").href = "aggiungiRecensione?isbn="+isbn;
  httpGetBook(isbn);
  httpGetReviews(isbn);


}
buildPage();
