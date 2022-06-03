const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName : { type : String},
    email : { type :String , unique : true},
    mobile : { type : String, required : true},
    password : { type: String, required : true}
})

module.exports = mongoose.model('User',userSchema)