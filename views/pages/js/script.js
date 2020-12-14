var filter = ["?"];   // array for filter and use get


function dropDownFun(x) {           //for dop down the menu when u click away
  var dropdowns = document.getElementsByClassName("dropdown-content");
  var i;
  for (i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    var id = openDropdown.getAttribute("id");
    if(id !== "myDropdown"+x) {
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
  document.getElementById("myDropdown"+x).classList.toggle("show");
}

function funFilter() {
  document.getElementById("myBtnContainer").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !event.target.matches('.insertText') ) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

document.getElementById('searchBarAuthor').onkeydown = function(e){   //function to submit with the "ENTER"
   if(e.keyCode == 13){
     filterBooks('author','');
   }
};
document.getElementById('fromYear').onkeydown = function(e){  //function to submit with the "ENTER"
   if(e.keyCode == 13){
     filterBooksForYears();
   }
};
document.getElementById('toYear').onkeydown = function(e){  //function to submit with the "ENTER"
   if(e.keyCode == 13){
     filterBooksForYears();
   }
};

function isIncluded(type, val) {            //check if val is included on the filter
  for(var j = 0; j<filter.length; j++) {
    if(filter[j].includes(type)) {
      filter[j] = type+'='+val;
      return true;
    }
  }
  return false;
}

function isIncludedForYear(from, to) {    //check if year is included on the filter
  for(var j = 0; j<filter.length; j++) {
    if(filter[j].includes('from_year')) {
      filter[j] = 'from_year='+from+'&to_year='+to;
      return true;
    }
  }
  return false;
}

function selectBadge(type,val) {                      //function that show the badge filter
  if(type == "title") {
    val = document.getElementById("searchBar").value;
    var badge = document.getElementById("badge-"+type);
    var badgeText = document.getElementById("badgeText-"+type);
    if(val == "") {
        badge.classList.remove("showBadge");     //hide badge filter
    }
    else {
        badgeText.innerHTML= val;
        if(!(badge.classList.contains("showBadge")))  //check flag if i have to show bagde again, toogle function is like a swtich
         badge.classList.toggle("showBadge");    // show badge filter
    }
  }
  else if(type == "author"){
    val = document.getElementById("searchBarAuthor").value;
    var badge = document.getElementById("badge-"+type);
    var badgeText = document.getElementById("badgeText-"+type);
    if(val == "") {
        badge.classList.remove("showBadge");     //hide badge filter
    }
    else {
        badgeText.innerHTML= val;
        if(!(badge.classList.contains("showBadge")))  //check flag if i have to show bagde again, toogle function is like a swtich
         badge.classList.toggle("showBadge");    // show badge filter
    }
  }
  else {
    var badge = document.getElementById("badge-"+type);
    var badgeText = document.getElementById("badgeText-"+type);
    badgeText.innerHTML= val;
    if(!(badge.classList.contains("showBadge")))             //check flag if i have to show bagde again, toogle function is like a swtich
      badge.classList.toggle("showBadge");
  }
}

function badgeShow (type,val) {
  switch(type) {
    case "title":
      selectBadge(type,val);
    break;
    case "genre":
      selectBadge(type,val);
    break;
    case "author":
      selectBadge(type,val);                  // show badge filter
    break;
    case "from_year":
      selectBadge(type,val);
    break;
    case "from_rating":
      val= "Rating >" + val;
      selectBadge(type,val);
    break;
    default:
    break;
  }
}

function httpGetBooks (text) {      //GET for books
  if(text == "") {
    fetch('../api/books')          //GET for all books on the DB
    .then((resp) => resp.json())
    .then(function(data) {
        loadBooks(data);
        return;
    })
    .catch( error => console.error(error) );
  }
  else {
    fetch('../api/books' + text.toString())  //GET for books filtered, text are the filters
    .then((resp) => resp.json())
    .then(function(data) {
        loadBooks(data);
        return;
    })
    .catch( error => console.error(error) );
  }
}

function filterBooks(type,val) {                    //function that manage the system of the filters
      if(type === undefined && val === undefined) {
        httpGetBooks("");
      }
      else {
        badgeShow(type,val);
        if(type=="title")                            //special case when we filter with search bar, we need to update the value bc is not static;
          val = document.getElementById("searchBar").value;
        else if(type == "author")                     //special case when we filter with search bar, we need to update the value bc is not static;
          val = document.getElementById("searchBarAuthor").value;
        var txt = type+'='+val;
        if(filter.length == 1)
          filter.push(txt);
        else if(isIncluded(type,val)) {
          //pass
        }
        else {
              filter.push('&');
              filter.push(txt);
        }
        txt = '';
        for(var i of filter) { // filter is the global array for the filter reminder and "i" is the field of the array
          txt+=i;             // add all field in a global string for giving to get request
        }
        httpGetBooks(txt);
      }
}

function filterBooksForYears() {
      var fromyear = document.getElementById("fromYear").value;
      if(fromyear.length == 0) {
        alert("Il campo DA ANNO non puó essere vuoto");
        return false;
      }
      var toyear = document.getElementById("toYear").value;
      if(toyear.length == 0) {
        toyear = 2020;
      }
      badgeShow("from_year",fromyear+"-"+toyear);
      var txt = 'from_year='+fromyear+'&to_year='+toyear;
      if(filter.length == 1)
        filter.push(txt);
      else if(isIncludedForYear(fromyear,toyear)) {
        //pass
      }
      else {
            filter.push('&');
            filter.push(txt);
      }
      txt = '';
      for(var i of filter) { // filter is teh glob array for the filter reminder and i are the field of the array
        txt+=i;             // add all field in a global string for giving to get request
      }
      httpGetBooks(txt);
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

function loadBooks(data) {                      //load books on the page
    const ul = document.getElementById('tbody');
    var txt = '';
    for(let lib of data) {
      txt+= '<tr>';
      txt+= '<td><a href="libro?isbn='+lib.isbn+'">'+lib.isbn+'</a></td>';
      txt+= '<td>'+lib.title+'</td>';
      txt+= '<td>'+lib.author+'</td>';
      txt+= '<td>'+lib.genre+'</td>';
      txt+= '<td>'+lib.year+'</td>';
      txt+= '<td>';
      if(lib.rating == null){
        txt+="Nessuna recensione disponibile";
      } else {
        txt+= createStars(lib.rating);
      txt+='</td>';
      txt+= '</tr>';
      }
    }
    ul.innerHTML = txt; // text html that we insert
}


function removeFilter(type) {                         //remove badge of filters
  var badge = document.getElementById("badge-"+type);
  var txt = '';
  badge.classList.remove("showBadge");
  flag= true;             // flag activing badge title
  if(type == "title")
    document.getElementById("searchBar").value="";
  for(var j = 0;j < filter.length; j++) {         // remove the filter, removing j position that is name=value
    if(filter[j].includes(type)) {
        filter.splice(j-1,2);
    }
  }
  if(filter[0]!= '?') {    // check if delete first filter, if yes i restore = "?" as first field
    filter[0]="?";
  }
  for(var i of filter) { // filter is teh glob array for the filter reminder and i are the field of the array
    txt+=i;             // add all field in a global string for giving to get request
  }
  httpGetBooks(txt);
}

filterBooks(undefined,undefined); // first call gives all books
if(!userId()) //check if the user is logged, if dont the page hides the button "add book"
  document.getElementById("addBook").style.display= "none";
