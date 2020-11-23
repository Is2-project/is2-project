function checkItem(indexF, checkF){
    for (let i of indexF) {
        if(checkF[i]!=true){
            return false;
        }
    }
    return true;
}

const storage = {
    books: [],
    reviews: [],
    maxIdReviews: 0
};

const users = {

    users: [],
    maxid: 0,

    //inserts a new user into the db (adding the property id to it) and returns the updated user
    insert(user) {
        user.id = this.maxid++;
        this.users.push(user);
        return user;
    },

    //returns the user with that id or null if there is none
    get(id) {
        const idx = this.users.findIndex((user) => user.id === id);
        
        if(idx < 0) {
            return null;
        }

        return this.users[idx];
    },

    //returns the user with that email or null if there is none
    getByEmail(email) {
        const idx = this.users.findIndex((user) => user.email === email);
    
        if(idx < 0) {
            return null;
        }

        return this.users[idx];
    },

    //updates the user with id === user.id with the new data
    update(user) {
        const idx = this.users.findIndex((u) => u.id === user.id);
        
        if(idx < 0) {
            return false;
        }

        this.users[idx] = user;

        return true;
    }

}


/*devo ancora testarli*/
const reviews = {
    /* /api/review */
    insert(review){
        console.log("DEBUG 300");
        review.id = storage.maxIdReviews++;
        storage.reviews.push(review);
        return review.id;
    },
    /* /api/review/id */
    findReviewById(id) {
        console.log("DEBUG 400");
        return storage.reviews.find(x => (x.id == id) );
    }
    /*
    ,
    getAllByIsbn(isbn){
        whichBook = [];
        let booksTitle = storage.book.map(x => (x.isbn==isbn));

        var isbnReviews 

    }
    */
}


const books = {
    insert(book) {
        storage.books.push(book);
        return book.isbn;
    },
    findByIsbn(isbn) {
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
            //console.log(userParam[a]);
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

                    fieldOfItem = item[description].toString().toLowerCase(); //informazione che ha inserito l'utente
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
            return booksFind;
        }           
    },
    all(){ 
        return storage.books;
    }
};

//popolamento "db"
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


var review1 = reviews.insert({
    description: "Recensione 1",
    rating: 4,
    book: "Libro 1",
    user: "User 1",
});

var review2 = reviews.insert({
    description: "Recensione 2",
    rating: 3,
    book: "Ciccio",
    user: "User 2",
});

var review3 = reviews.insert({
    description: "Recensione 3",
    rating: 5,
    book: "Libro 3",
    user: "User 3",
});

module.exports = {
    books,
    users,
    reviews
};
