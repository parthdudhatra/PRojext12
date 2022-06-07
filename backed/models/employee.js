const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
    firstName : { type : String, required : true},
    lastName : { type : String, required : true},
    email : { type : String, required : true},
    mobile : { type : String, required : true},
    salary : { type : String, required : true}
})

module.exports = mongoose.model('Employee', employeeSchema);