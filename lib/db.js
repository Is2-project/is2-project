const { set } = require("./app");

const storage = {
    books: []
};

const books = {
    insert(book) {
        storage.books.push(book);
        return book.isbn;
    },
    findByIsbn(isbn) {
        return storage.books.find(x => x.isbn);
    },
    getBooks(userParam) {
        var vectOfParam = [];
        var i=1;
        vectOfParam[0]=undefined;
        
        //salvo i parametri dell'utente dentro questo array
        for(let a in userParam){
            vectOfParam[i]= userParam[a];
            i++;
        }

        var entered = false;
        var booksFind = [];

        //se trovo un pattern tra cio'che inserisce l'utente e quello che ho salvato aggiungo nel risultato il libro
        for(var item of storage.books) {
            i=0;
            for(var description in item){
                if(!entered && !(typeof(vectOfParam[i])==='undefined') && item[description].includes(vectOfParam[i].valueOf()) ){
                    // vectOfParam[i] -> USER INPUT      item[description] -> DB INFORMATION);
                    booksFind.push(item);
                    entered = true;
                } 
                i++;
            }
            entered = false;
        }              
        if(booksFind)
            return booksFind; 
    },
    all(){ //giusto 100%
        console.log("Debug 300");
        return storage.books;
    }
};

var book1 = books.insert({
    isbn: "1-1",
    title: "Libro 1",
    author: "Autore 1",
    year: 2010,
    genre: "Genre 1",
    rating: 5
});

var book2 = books.insert({
    isbn: "2-2",
    title: "Ciccio",
    author: "Ciccio",
    year: 2011,
    genre: "Genre 2",
    rating: 4
});

var book3 = books.insert({
    isbn: "3-3",
    title: "Libro 3",
    author: "Autore 3",
    year: 2012,
    genre: "Genre 3",
    rating: 3
});

module.exports = {
    books
};