function deleteRew(id) {
  fetch('../api/reviews/' + id.toString(), {
    method:'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getToken()
    }
  })
  .then(resp => {
    if(resp.status == 200) {
      buildPage();
    }
    else if(resp.status == 400){
      buildPage();
      alert("Non puoi inserire questo voto!");
    }
    else if(resp.status == 401){
      buildPage();
      alert("Non puoi eliminare la recensione di qualcun'altro oppure devi eseguire l'accesso!");
    }
    else if(resp.status == 404){
      buildPage();
      alert("Recensione non esistente!");
    }
    else if(resp.status == 500){
      buildPage();
      alert("Errore del database!");
    }
      return;
  })
  .catch( error => console.error(error) );
}
function checkLikeRew(id_rew) {
  //CHECK IF LIKE IS TRUE
  fetch('../api/reviews/'+ id_rew.toString()+'/like', {
    method:'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getToken()
    }
  })
  .then((resp) => resp.json())
  .then(function(data) {
    var like = document.getElementById("like"+id_rew);
    if(data.like === true)
      if(!like.classList.contains("checked"))
        like.classList.toggle("checked");
    return;
  })
  .catch( error => console.error(error) );

  //CHECK IF DISLIKE IS TRUE
  fetch('../api/reviews/'+ id_rew.toString()+'/dislike', {
    method:'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getToken()
    }
  })
  .then((resp) => resp.json())
  .then(function(data) {
    var dislike = document.getElementById("dislike"+id_rew);
    if(data.dislike === true)
      if(!dislike.classList.contains("checked"))
        dislike.classList.toggle("checked");
    return;
  })
  .catch( error => console.error(error) );
}
function refreshLikes (rew_id) {
  var like = document.getElementById("numLikes"+rew_id);
  var dislike = document.getElementById("numDislikes"+rew_id);
  fetch('../api/reviews/'+ rew_id.toString())
  .then((resp) => resp.json())
.then(function(data) {
      like.innerHTML = data.likes;
      dislike.innerHTML = data.dislikes;
      return;
  })
  .catch( error => console.error(error) );
}

function setLike(text,id_rew) {
  if(userId() !== false) {
    var elem = document.getElementById(text+id_rew);
    if(text === "like")
      document.getElementById("dislike"+id_rew).classList.remove("checked");
    else if (text === "dislike")
      document.getElementById("like"+id_rew).classList.remove("checked");

    if(elem.classList.contains("checked")) {
      fetch('../api/reviews/'+id_rew.toString()+'/'+text , {
        method:'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        }
      })
      .then(resp => {
        if(resp.status == 200) {
          refreshLikes(id_rew);
        }
        else if(resp.status == 400){
          alert("Non puoi votare la tua recensione!");
        }
        else if(resp.status == 401){
          alert("Devi essere loggato per poter votare!");
        }
        else if(resp.status == 404){
          alert("Recensione non trovata!");
        }
        else if(resp.status == 500){
          alert("Database error!");
        }
          return;
      })
      .catch( error => console.error(error) );
    }
    else {
      fetch('../api/reviews/'+id_rew.toString()+'/'+text , {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        }
      })
      .then(resp => {
        if(resp.status == 200) {
          refreshLikes(id_rew);
        }
        else if(resp.status == 401){
          alert("Devi essere loggato per poter votare!");
        }
        else if(resp.status == 404){
          alert("Recensione non trovata!");
        }
        else if(resp.status == 500){
          //document.getElementById("like"+id_rew).classList.remove("checked");
          //document.getElementById("dislike"+id_rew).classList.remove("checked");
          alert("Database error!");
        }
          return;
      })
      .catch( error => console.error(error) );
    }
    elem.classList.toggle("checked");
  }
  else {
    alert("Devi essere loggato!");
    window.location.href = "/";
  }
}

function loadUser(data) {         //load name user on the reviews
  var nickName = '';
  if(data!==undefined) {
    nickName=data.name+' '+data.surname;
    nickName+="<div style='width:20%; display:inline-block;'>";
      nickName+= "<a class='popup' rel=";
        switch(data.level) {
          case 0:
            nickName+="'Newbie'";
          break;
          case 1:
            nickName+="'Beginner'";
          break;
          case 2:
            nickName+="'Reviewer'";
          break;
          case 3:
            nickName+="'Expert'";
          break;
          case 4:
            nickName+="'Master'";
          break;
          case 5:
            nickName+="'Piero Angela'";
          break;
          default:
            nickName+="'Error'";
          break;
        }
        nickName+="><img src=\'img/"+data.level+".svg\' style='width:15px; margin-left:10px;'>";
      nickName+="</a>";
    nickName+="</div>";

    var ul = document.getElementById('td'+data.id); //get the reviews that an user has written
    ul.innerHTML = nickName;                  //set the name
  }
  else {
    nickName='ERROR';
  }
}

/*var parent = document.getElementById('parent');
var popup = document.getElementById('popup');
parent.onmouseover = function() {
  if
  popup.style.display = 'block';


}
parent.onmouseout = function() {
  popup.style.display = 'none';
}*/

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
  var flag= false;
  var loc = location.hostname;
  const ul = document.getElementById('tbody');      //set up the page with the reviews
  var txt = '';
  if(data[0] !== undefined) {
    for(let rew of data) {
      txt+= '<tr>';
      //txt+= '<td name= td'+rew.user+'>'+rew.user+'</td>'; httpGetUserName(rew.user);        // now we stamp the id of user we have a p[roblem to syncronize the fun that take the name of user
        txt+= '<td id= td'+rew.user+'></td>'; httpGetUserName(rew.user);        // now we stamp the id of user we have a p[roblem to syncronize the fun that take the name of user
      txt+= '<td>';
      txt+= createStars(rew.rating);
      txt+='</td>';
      txt+= '<td>'+rew.description+'</td>';
      if(rew.user == userId()) { // controllo se la recensione é stata fatta dall'utente loggato al momento
        document.getElementById("addReview").style.display = "none";
        txt+= "<td>";
          txt+="<div style='margin-bottom:10px;'>";
            txt+="<a href='aggiungiRecensione?isbn="+rew.book+"&id="+rew.id+"&action=true' style='background-color: rgb(32,178,170); 'class='btn btn-primary a-btn-slide-text'>";
              txt+="<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>";
              txt+="<span><strong>";
                txt+="<img style='width:20px' src='img/matita.svg'>";
              txt+="</strong></span>";
            txt+="</a>";
            txt+= "<a style='background-color: rgb(200,0,0); margin-left:7px; 'class='btn btn-primary a-btn-slide-text' onclick=\"deleteRew(\'"+rew.id+"\')\">";
              txt+="<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>";
              txt+="<span><strong>";
                txt+="<img style='width:20px' src='img/delete.svg'>";
              txt+="</strong></span>";
            txt+="</a>";
          txt+="</div>";
          txt+="<figure style='margin-right:40px;'>";
            txt+="<a><img style='width: 25px;' src='img/like.svg'><figcaption id='numLikes"+rew.id+"'>"+rew.likes+"</figcaption></a>";
          txt+="</figure>";
          txt+="<figure>";
            txt+="<a><img style='width: 25px;' src='img/dislike.svg'><figcaption id='numDislikes"+rew.id+"'>"+rew.dislikes+"</figcaption></a>";
          txt+="</figure>";
        txt+="</td>";
      }
      else if(userId()!== false){
        txt+="<td>";
          txt+="<figure style='margin-right:40px;'>";
            txt+="<a onclick=\"setLike(\'like\',\'"+rew.id+"\')\"; id='like"+rew.id+"' class='classLike'><img style='width: 25px;' src='img/like.svg'><figcaption id='numLikes"+rew.id+"'>"+rew.likes+"</figcaption></a>";
          txt+="</figure>";
          txt+="<figure>";
            txt+="<a onclick=\"setLike(\'dislike\',\'"+rew.id+"\')\"; id='dislike"+rew.id+"' class='classLike'><img style='width: 25px;' src='img/dislike.svg'><figcaption id='numDislikes"+rew.id+"'>"+rew.dislikes+"</figcaption></a>";
          txt+="</figure>";
        txt+="</td>";
        checkLikeRew(rew.id);
      }
      else {
        txt+="<td>";
          txt+="<figure style='margin-right:40px;'>";
            txt+="<a><img style='width: 25px;' src='img/like.svg'><figcaption id='numLikes"+rew.id+"'>"+rew.likes+"</figcaption></a>";
          txt+="</figure>";
          txt+="<figure>";
            txt+="<a><img style='width: 25px;' src='img/dislike.svg'><figcaption id='numDislikes"+rew.id+"'>"+rew.dislikes+"</figcaption></a>";
          txt+="</figure>";
        txt+="</td>";
      }
      txt+= '</tr>';
    }
  }
  else {
    txt+='<tr>';
      txt+= '<td colpsan = "4"> Non ci sono recensioni per questo libro!</td>';
    txt+="</tr>";
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

function httpGetLike(id_rew){
  var user = userId();

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
    fetch('../api/books/' + isbn.toString())
    .then((resp) => resp.json())
    .then(function(data) {
        loadBooks(data);
        return;
    })
    .catch( error => console.error(error) );
}

function httpGetReviews (isbn) {  // get the reviews of the book and build the table
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
  httpGetBook(isbn);
  httpGetReviews(isbn);
  if(!userId())
    document.getElementById("addReview").style.display= "none";
  else {
    document.getElementById("addReview").href = "aggiungiRecensione?isbn="+isbn;
    document.getElementById("addReview").style.display= "inline-block";
  }


}
buildPage();
