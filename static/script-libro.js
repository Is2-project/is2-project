var titleBook = '';

function loadReviews(data) {
  const ul = document.getElementById('tbody');
  var txt = '';
  for(let rew of data) {
    txt+= '<tr>';
    txt+= '<td>'+rew.user+'</td>';
    txt+= '<td>'+rew.rating+'</td>';
    txt+= '<td>'+rew.description+'</td>';
    txt+= '</tr>';
  }
  ul.innerHTML = txt; // text html that we insert
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
