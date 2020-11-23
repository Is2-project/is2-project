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

/**
 * This class will manage db access to users (for now it is the db itself)
 */
class Users {

    constructor() {
        /** @private */
        this.users = [];

        /** @private */
        this.maxid = 0;
    }

    /**
     * Inserts a new user into the db (adding the property id to it) and returns the updated user
     * @param       {object} user               The user object
     * @returns     {number}                    The updated user object (there will be the user id)
     */
    insert(user) {
        user.id = this.maxid++;
        this.users.push(user);
        return user;
    }

    /**
     * Returns the user with that id or null if there is none
     * @param       {number} id               The user's unique id
     * @returns     {object | null}           The user's object if found, null otherwise
     */
    get(id) {
        const idx = this.users.findIndex((user) => user.id === id);
        
        if(idx < 0) {
            return null;
        }

        return this.users[idx];
    }


    /**
     * Returns the user with that email or null if there is none
     * @param       {string} email            The user's email address
     * @returns     {object | null}           The user's object if found, null otherwise
     */
    getByEmail(email) {
        const idx = this.users.findIndex((user) => user.email === email);
    
        if(idx < 0) {
            return null;
        }

        return this.users[idx];
    }

    /**
     * Updates the user with id === user.id with the new data
     * @param       {object} user       The user's object with the updated values
     * @returns     {boolean}           True if the user was found, false otherwise
     */
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
    
    /**
     * @param       {object} review          The review object
     * @returns     {number}                 The newly created review's unique id
     */
    insert(review){
        console.log("DEBUG 300");
        review.id = storage.maxIdReviews++;
        storage.reviews.push(review);
        return review.id;
    },
    
    /**
     * @param       {number} id         The review's unique id
     * @returns     {object | undefined}     the review object if found, null otherwise
     */
    findReviewById(id) {
        console.log("DEBUG 400");
        return storage.reviews.find(x => (x.id == id));
    },
    
    /**
     * @param       {string} book       The book's isbn unique code.
     * @returns     {object[]}          All the reviews of the provided book
     */
    findByBook(book) {
        return storage.reviews.filter((review) => review.book === book);
    },

    /**
     * @param       {number} user          The unique user id
     * @returns     {object[]}          All the reviews made by the provided user
     */
    findByUser(user) {
        return storage.reviews.filter((review) => review.user === user);
    },

    /**
     * @param       {string} book       The book's isbn unique code.
     * @returns     {number | null}        The book's average rating or null if there are no reviews
     */
    getBookRating(book) {
        const reviews = this.findByBook(book);
        if(reviews.length > 0) {
            return reviews.map((r) => r.rating).reduce((a, b) => a+b) / reviews.length;
        } else {
            return null;
        }
    }
   
}


const books = {

    /**
     * 
     * @param   {object} book        The book whose id I want to know
     * @returns {string}             The book's isbn
     */
    insert(book) {
        storage.books.push(book);
        return book.isbn;
    },

    /**
     * 
     * @param  {string} isbn         Isbn of a book
     * @return {object}              The book which has the isbn we are searching for
     */
    findByIsbn(isbn){
        return storage.books.find(x => (x.isbn == isbn));
    },

    /**
     *  
     * @param  {object} userParam     All filters that user uses for searching books
     * @return {object}              All the books that satisfy the filter defined by user
     */
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
    /**
     * @returns {object}        All the books in the database
     */
    all(){ 
        return storage.books;
    },
    /**
     *  
     * @param   {string} name     The title of a book that a user is searching for
     * @returns {object}          The book wich has the right name, null else
     */
    //returns the user with that email or null if there is none
    existBook(name) {
        const idx = storage.books.findIndex((book) => book.title === name);
    
        if(idx < 0) {
            return null;
        }

        return storage.books[idx];
    }
};

//popolamento "db"
books.insert({
    isbn: "2137549682046",
    title: "Albero",
    author: "Johnny",
    genre: "Horror",
    year: 2010
});

books.insert({
    isbn: "6749513827659",
    title: "Ciccio",
    author: "Pasticcio",
    genre: "Fantascienza",
    year: 2011
}); 

books.insert({
    isbn: "4527838565217",
    title: "Halloween",
    author: "Erik",
    genre: "Thriller",
    year: 2012
});

books.insert({
    isbn: "969872451302",
    title: "Mascherina",
    author: "Quarantena",
    genre: "Comico",
    year: 2020
});

books.insert({
    isbn: "4275156683967",
    title: "Crollo di Trump",
    author: "Gigino",
    genre: "Documentario",
    year: 2020
});

books.insert({
    isbn: "1574863965202",
    title: "Terra promessa",
    author: "Barack Obama",
    genre: "Biografico",
    year: 2020
});

books.insert({
    isbn: "3754692815698",
    title: "Colla",
    author: "welsh",
    genre: "Commedia",
    year: 2015
});

books.insert({
    isbn: "5538644729139",
    title: "Lo scudo",
    author: "Manfredi",
    genre: "Azione",
    year: 2017
});

books.insert({
    isbn: "3478256114253",
    title: "La montagna incantata",
    author: "Corona",
    genre: "Fantascienza",
    year: 2016
});

books.insert({
    isbn: "4529861437659",
    title: "Harry potter",
    author: "JK Rowling",
    genre: "Fantascienza",
    year: 2001,
    rating: 3
});

reviews.insert({
    description: "Recensione 1",
    rating: 2,
    book: "2137549682046",
    user: 0,
});

reviews.insert({
    description: "Recensione 2",
    rating: 3,
    book: "2137549682046",
    user: 0,
});

reviews.insert({
    description: "Recensione 3",
    rating: 5,
    book: "2137549682046",
    user: 0,
});

const users = new Users();

users.insert({
    email: 'carloramponi99@libero.it',
    password: '91cf9311a4d4499cab3d64dc5aad0c83', /* 12345678 */
    salt: '6ef8d3cf',
    name: 'Carlo',
    surname: 'Ramponi',
    phone: null
});

module.exports = {
    books,
    users,
    reviews
};
