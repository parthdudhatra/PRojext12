const express = require('express');

const router = express.Router();
const User = require('../models/user');
const Employee = require('../models/employee')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const checkAuth = require('../middeware/check-auth');
const { json } = require('express/lib/response');
const res = require('express/lib/response');


// signup
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

// login
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
// profile
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

// router.post('/create', (req, res, next) => {
//     const employee = new Employee({
//         _id : req.body.id,
//         firstName : req.body.firstName,
//         lastName : req.body.lastName,
//         email : req.body.email,
//         mobile : req.body.mobile,
//         salary : req.body.salary
//     });
//     employee.save().then((createdEmployee) => {
//         res.json({ success : true, message : "Employee added successfully", employeeId : createdEmployee._id})
//    }).catch((err) => {
//        if(err.code === 11000){
//            return res.json({ success: false, message : "Something is wrong"})
//        }
//    })
// })

// router.get("/list",(req, res, next) => {
//     Employee.find().then((document) => {
//         return res.json( { success : true , message : "Data Fetched successfully", employees : document})
//     }).catch((err) => {
//         return res.json ({success : false , message : "Data not Fetched successfully"})
//     })
// })

// Add Employee

router.post('/add-employee', (req, res, next) => {
    Employee.create(req.body,(err, data)=>{
        if(err) {
            return next(error)
        }else {
            res.json(data)
        }
    })
})

// get all employee

router.get('/', (req, res, next) => {
    Employee.find((err, data) => {
        if(err) {
            return next(error)
        }else{
            res.json(data)
        }
    })
})

//same as this all
// Get Book by Id

router.get("/:id", (req, res, next) => {
    Employee.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    });
  });

// Update the employee

router.put("/:id", (req, res, next) => {
    Employee.findByIdAndUpdate(req.params.id, {
        $set : req.body
    },(error, data) => {
        if(error) {
            return next(error)
            console.log(error)
        }else{
            res.json(data)
            console.log("Employee updated successfully")
        }
    })
  });

// Detete the employee

router.delete('/delete-employee/:id',(req, res, next) => {
    Employee.findByIdAndRemove(req.params.id,(err , data) => {
        if(err) {
            return next (error)
        }else{
            res.status(200).json({
                msg : data
            })
        }
    })
})

// QTgHowBxcjmbSfzi
module.exports = router;