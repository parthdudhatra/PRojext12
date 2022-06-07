const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
const port = process.env.PORT || 8080
const authRoute = require('./routes/auth-route');
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}))
app.use(cors());

mongoose.connect("mongodb+srv://parth:QTgHowBxcjmbSfzi@cluster0.7wozhbs.mongodb.net/?retryWrites=true&w=majority",
    (err) =>{
        if(err){
            console.log("Db is not connecting")
        }
        else{
            console.log("Db is connecting")
        }
    }   
)

app.use('/auth',authRoute)



app.listen(port , () => {
    console.log("server is connected", port)
})