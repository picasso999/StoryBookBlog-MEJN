const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const methodOverride = require('method-override');


//Load  Models
require('./models/User');
require('./models/Story');

//Passport Config
require('./config/passport')(passport);

//Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

//Load keys
const keys = require('./config/keys');

//Handlebars Helpers
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
} = require('./helpers/hbs');

//Map global promises
mongoose.Promise = global.Promise;
//Mongoose connect
mongoose.connect(keys.mongoURI, {
    useMongoClient:true
}).then(()=>console.log('MongoDB connected')).catch(err => console.log(err));

const app = express();

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended:false}));
//parse application//json
app.use(bodyParser.json());

//Method Override Middleware
app.use(methodOverride('_method'));

//Handlebars middleware
app.engine('handlebars',exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select:select,
        editIcon:editIcon
    },
    defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:false
}))

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//set golbal vars
app.use((req,res,next)=>{
    res.locals.user = req.user ||null;
    next();
});

//set static folder
app.use(express.static(path.join(__dirname,'public')));

//Use Routes
app.use('/',index);
app.use('/auth',auth);
app.use('/stories',stories);

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`server started on port ${port}`);
});