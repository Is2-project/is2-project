function checkItem(indexF, checkF){
    for (let i of indexF) {
        if(checkF[i]!=true){
            return false;
        }
    }
    return true;
}

const storage = {
    books: []
};

const books = {
    insert(book) {
        storage.books.push(book);
        return book.isbn;
    },
    findByIsbn(isbn) {
        console.log("eseguita GET /api/book/isbn");
        return storage.books.find(x => (x.isbn == isbn) );
    },
    getBooks(userParam) {
        var vectOfParam = [];
        var i=1;
        var check = [false,false,false,false,false,false,false];
        var index = [];

        vectOfParam[0]=undefined; //isbn in this case always undefined

        //salvo i parametri dell'utente dentro questo array, se i dati non sono presenti sono 'undefined'
        for(let a in userParam){
            console.log(userParam[a]);
            if( (userParam[a]!==undefined) ){
                vectOfParam[i]= userParam[a].toLowerCase();
                index.push(i) // ora bbiamo gli indici di vectOfParam in cui gli oggetti NON sono undefined
            }
            i++;
        }
        var booksFind = [];
        var fieldOfItem; 

        //se trovo un pattern tra cio'che inserisce l'utente e quello che ho salvato aggiungo nel risultato il libro
        for(var item of storage.books) {
            i=0;
            check = [false,false,false,false,false,false,false];
            for(var description in item){
                if( (vectOfParam[i])!==undefined ){

                    fieldOfItem = item[description].toLowerCase(); //informazione che ha inserito l'utente
                    if( (i<4) && fieldOfItem.includes(vectOfParam[i].valueOf()) ){
                        // vectOfParam[i] -> USER INPUT      fieldOfItem -> DB INFORMATION);
                        check[i] = true;
                    } 
                    else if(i==4){
                    //if( !(typeof(vectOfParam[i+1])==='undefined')){ // inutile perche se c'e' from_year c'e' sempre anche to_year per come abbiamo definito la UI
                        if( (vectOfParam[i]<=fieldOfItem) &&   (fieldOfItem<=vectOfParam[i+1])){
                            check[i] = true;    
                            i++;// cosi arrivo al rating direttamente
                            check[i] = true;             
                        }
                    //}
                    }
                    //seleziono i libri (fieldOfItem) con rating >= a quelli inseriti dall'utente (vectOfParam[i])
                    else if( (i==6) && vectOfParam[i]<=fieldOfItem){        
                        check[i] = true;               
                    }           
                }
                i++;
                if(i==5){
                    i++; // punto al rating se non esiste il from_year e di conseguenza non esiste nemmeno il to_years
                }
                if(i==7){
                    if(checkItem(index, check)){
                        booksFind.push(item); 
                    }
                }    
            }
            fieldOfItem = "";
        }
        if(booksFind){
            console.log("eseguita GET /api/book con parametri");
            return booksFind;
        }           
    },
    all(){ 
        console.log("eseguita GET /api/book senza parametri");
        return storage.books;
    }
};



var book1 = books.insert({
    isbn: "1-1",
    title: "Libro 1",
    author: "Autore 1",
    genre: "Genre 1",
    year: 2010,
    rating: 5
});

var book2 = books.insert({
    isbn: "2-2",
    title: "Ciccio",
    author: "Ciccio",
    genre: "Genre 2",
    year: 2011,  
    rating: 4
}); 

var book3 = books.insert({
    isbn: "3-3",
    title: "Libro 3",
    author: "Autore 3",
    genre: "Genre 3",
    year: 2012,
    rating: 3
});

module.exports = {
    books
};