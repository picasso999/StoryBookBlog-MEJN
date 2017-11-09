const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

//Passport Config
require('./config/passport')(passport);


//Lod Routes
const auth = require('./routes/auth');


const app = express();

app.get('/',(req,res)=>{
    res.send('It works!');
});

//Use Routes
app.use('/auth',auth);

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`server started on port ${port}`);
});