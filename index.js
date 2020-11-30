const app = require('./lib/app.js');
const mongoose = require('mongoose');

const port = process.env.PORT || 8000;
let mongourl;

if(process.env.MONGOURL) {
    mongourl = process.env.MONGOURL
} else {
    mongourl = require('./secrets.json').mongodb_url;
}

app.locals.db = mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then ( () => {
    
    console.log("Connected to Database");
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    
});


