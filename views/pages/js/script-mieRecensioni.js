function deleteRew(id) {        //delete rew by user
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
  
  function createStars(rating) {    //create the stars of the reviews
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
  
  function loadReviews(data) {      //load on the page the reviews
    const ul = document.getElementById('tbody');      //set up the page with the reviews
    var txt = '';
    if(data[0] !== undefined) {
      for(let rew of data) {
        if(rew.user == userId()) { // controllo se la recensione é stata fatta dall'utente loggato al momento
          var date = rew.date;
          date = date.replace("T"," ");
          date = date.substring(0,date.length-5); 

          txt+= "<tr>";

            txt+= "<td id="+rew.book+"></td>"; 
            
            httpGetBook(rew.book);

            txt+= "<td>";
              txt+= createStars(rew.rating);
            txt+="</td>";

            txt+= "<td>";
              txt+= "<a class='popup datetime' rel='"+date+"';> <img src='img/datetime.svg' style='width:18px;'> </a>";
              txt+= "<p>"+rew.description+"</p>";        
            txt+='</td>';

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
        else{
          txt+= '<tr><td colpsan = "4"> Error!</td></tr>';
        }
        txt+= '</tr>';
      }
    }
    else {
      txt+='<tr>';
        txt+= '<td colpsan = "4"> Non hai scritto ancora nessuna recensione! Corri a Farlo!</td>';
      txt+="</tr>";
    }
    ul.innerHTML = txt;
  }
  
  function loadTitle(data) {    //load the book on the page
      const ul = document.getElementById(data.isbn);
      var txt = '';
      txt += '<a href="libro?isbn='+data.isbn+'">'+data.title+'</a>';
      ul.innerHTML = txt; // text html that we insert
  }
 

  function httpGetBook (isbn) {  //get the arg of the book and build the part of book present
      fetch('../api/books/' + isbn.toString())
      .then((resp) => resp.json())
      .then(function(data) {
          loadTitle(data);
          return;
      })
      .catch( error => console.error(error) );
  }
  
  function httpGetReviews (id) {  // get the reviews of the book and build the table
      fetch('../api/users/'+ id.toString()+'/reviews')
      .then((resp) => resp.json())
      .then(function(data) {
          loadReviews(data);
          return;
      })
      .catch( error => console.error(error) );
  }
  
  function buildPage () { // fun that build page
    const id = userId();
    if(id==false){
      window.location.href = "/signin";
    }
    else{
      httpGetReviews(id);
    }
  }
  
  buildPage();  //build the page at the start
  