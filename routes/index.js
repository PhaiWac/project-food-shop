const express = require('express'); 
const { default: mongoose } = require('mongoose');
const router = express.Router() ;

// const Users = require('../models/users');
// const Items = require('../models/items')
// const History = require('../models/history')
// const Food = require('../models/food')

const session = require('express-session');

// session check 
// router.get('/history' ,async (req , res  , next ) => {
    
//     const result = await History.find({email : req.session.email  })

//     res.render('history',{session : req.session , data : result})
// })



router.get('/',(req,res,next) => {
    if (!req.session.logged) {
        res.render('login' , {session : req.session})
    }
})

router.get('/register',(req,res) => {
    res.render('register',{session : req.session })
})

router.get('/home',(req,res) => {
    res.render('home',{
        session: req.session  ,
        foods : req.allfoods 
    })
})

router.get('/admin',(req,res) => {
    // const Food = new 
    // console.log(req.allFoods,'food')
    res.render('admin',{
        session : req.session  ,
        food : req.allFoods
    })
})

router.get('/orders',(req, res ) => {
    res.render('orders',{
        session : req.session,
        orders : req.orders 
    })
})

router.get('/myorder',(req,res) => {
    var all = 0 ;
    req.orders.forEach((v) => {
        all += v.pay     
    });

    res.render('myorder',{
        session : req.session,
        order : req.orders ,
        earn : all 
    })
})

router.get('/history',(req ,res) => {
    res.render('history',{
        session : req.session ,
        order : req.orders
    })
})

module.exports = router 