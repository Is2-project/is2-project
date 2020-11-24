var filter = ["?"];   // array for filter and use get


function myfun(x) {           //for dop down the menu when u click away
  var dropdowns;
  switch(x) {
    case 1:
      dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
      document.getElementById("myDropdown1").classList.toggle("show");
    break;
    case 2:
      dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
      document.getElementById("myDropdown2").classList.toggle("show");
    break;
    case 3:
      dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
      document.getElementById("myDropdown3").classList.toggle("show");
    break;
    case 4:
      dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
      document.getElementById("myDropdown4").classList.toggle("show");
    break;
    default:
    break;
  }
}

function funFilter() {
  document.getElementById("myBtnContainer").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !event.target.matches('.inyear') ) {
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
function isIncluded(type, val) {

  for(var j = 0; j<filter.length; j++) {
    if(filter[j].includes(type)) {
      filter[j] = type+'='+val;
      return true;
    }
  }
  return false;
}

function isIncludedForYear(from, to) {

  for(var j = 0; j<filter.length; j++) {
    if(filter[j].includes('from_year')) {
      filter[j] = 'from_year='+from+'&to_year='+to;
      return true;
    }
  }
  return false;
}

function selectBadge(type,val) {
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

function httpGetBooks (text) {           // commetto per vedere cosa chiedo
  if(text == "") {
    fetch('../api/books')
    .then((resp) => resp.json())
    .then(function(data) {
        loadBooks(data);
        return;
    })
    .catch( error => console.error(error) );
  }
  else {
    fetch('../api/books' + text.toString())
    .then((resp) => resp.json())
    .then(function(data) {
        loadBooks(data);
        return;
    })
    .catch( error => console.error(error) );
  }
}
function filterBooks(type,val) {
      if(type === undefined && val === undefined) {
        httpGetBooks("");
      }
      else {
        badgeShow(type,val);
        if(type=="title")                            //special case when we filter with search bar, we need to update the value bc is not static;
          val = document.getElementById("searchBar").value;
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

function loadBooks(data) {
    const ul = document.getElementById('tbody');
    var txt = '';
    for(let lib of data) {
      txt+= '<tr>';
      txt+= '<td><a href="libro.html?isbn='+lib.isbn+'">'+lib.isbn+'</a></td>';
      txt+= '<td>'+lib.title+'</td>';
      txt+= '<td>'+lib.author+'</td>';
      txt+= '<td>'+lib.genre+'</td>';
      txt+= '<td>'+lib.year+'</td>';
      txt+= '<td>'+lib.rating+'</td>';
      txt+= '</tr>';
    }
    ul.innerHTML = txt; // text html that we insert
}

function removeFilter(type) {
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
