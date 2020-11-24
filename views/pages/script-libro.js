var titleBook = '';
var nickName = '';

function loadUser(data) {
  var text = '';
  if(data[0]!==undefined) {
    nickName=data[0].name+' '+data[0].surname;
  }
  else {
    nickName='ERROR';
  }
}
function loadReviews(data) {
  const ul = document.getElementById('tbody');
  var txt = '';
  if(data[0] !== undefined) {
    for(let rew of data) {
      //httpGetUser(rew.user);
      txt+= '<tr>';
      txt+= '<td>'+rew.user+'</td>';
      txt+= '<td>';
      for(var i=0;i<rew.rating;i++) {
        txt+= '<i class="fas fa-star"></i>' //stampo le stelline
      }
      txt+='</td>';
      txt+= '<td>'+rew.description+'</td>';
      txt+= '</tr>';
    }
  //  for($i=0; $i<(int)$row['voto']; $i++)   //stampo le stelline
      //  echo '<i class="fas fa-star"></i>';
     // text html that we insert
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
    console.log("enter");
    console.log("title: "+data.title);
    txt+= '<h1>'+data.title+'</h1>'; titleBook = data.title;
    txt+= '<h6> Author: '+data.author+'</h3>';
    txt+= '<h6> Genre: '+data.genre+'</h3>';
    txt+= '<h6> Year: '+data.year+'</h3>';
    txt+= '<h6> Rating: '+data.rating+'</h3>';
    txt+= '<h6> Isbn: '+data.isbn+'</h3>';
    ul.innerHTML = txt; // text html that we insert
}

function httpGetUser (user) {
  console.log(user);            // commetto per vedere cosa chiedo
    fetch('../api/users/' + user.toString())
    .then((resp) => resp.json())
    .then(function(data) {
        loadUser(data);
        return;
    })
    .catch( error => console.error(error) );
}
function httpGetBook (isbn) {
  console.log(isbn);            // commetto per vedere cosa chiedo
    fetch('../api/books/' + isbn.toString())
    .then((resp) => resp.json())
    .then(function(data) {
        loadBooks(data);
        return;
    })
    .catch( error => console.error(error) );
}

function httpGetReviews (isbn) {
  console.log(isbn);            // commetto per vedere cosa chiedo
    fetch('../api/books/' + isbn.toString()+'/reviews')
    .then((resp) => resp.json())
    .then(function(data) {
        loadReviews(data);
        return;
    })
    .catch( error => console.error(error) );
}

function buildPage () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const isbn = urlParams.get('isbn');
  httpGetBook(isbn);
  httpGetReviews(isbn);


}
buildPage();
