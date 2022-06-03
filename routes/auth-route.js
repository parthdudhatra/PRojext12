const express = require('express');

const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const checkAuth = require('../middeware/check-auth')



router.post('/signup',(req, res) => {
    bcrypt.hash(req.body.password, 2, (err, hash) => {
        if(err) {
            return res.json({ success : false, message : "Massing issue"})
        } else {
            const user = new User({
                fullName : req.body.fullName,
                email : req.body.email,
                mobile : req.body.mobile,
                password : hash,
               })
               user.save().then(() => {
                    res.json({ success : true, message : "account has bben cerated"})
               }).catch((err) => {
                   if(err.code === 11000){
                       return res.json({ success: false, message : "Email already exited"})
                   }
               })
        }
    }) 
})

router.post('/login',(req, res) => {
    User.find({email : req.body.email})
        .exec()
        .then((result) => {
            if(result.length < 1) {
                return res.json({ success :false, message : "User Not Found"})
            }
            const user = result;
            bcrypt.compare(req.body.password, user.password, (ret , err) => {
                if(ret){
                    const payload = {
                        userId : user[0]._id
                    }
                    console.log(user[0]._id)
                    const token = jwt.sign(payload, 'parth')
                    return res.json({ success : true, token : token ,message : "Login Successfully"})
                }else {
                    return res.json( {success : false, message : "Password do not match"})
                }
            })
        }).catch(err => {
            res.json({ success :false, message : "Auth Failed"})
        })
});

router.get('/profile',checkAuth,(req, res) => {
    const userId = req.userData.userId;
    User.findById(userId)
        .exec()
        .then((result) => {
            res.json({success : true, data : result})
        }).catch(err => {
            res.json({ success : false, message : "Server error"})
        })
})
// QTgHowBxcjmbSfzi
module.exports = router;