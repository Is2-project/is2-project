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

module.exports = {
    users
}