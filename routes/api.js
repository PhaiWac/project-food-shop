const express = require('express') 
const router = express.Router() ;

//  model 

const Food = require('../models/food') 
const User = require('../models/users')
const Order = require('../models/order')
// const Order = require('../models/order')

// multer 
const multer = require('multer');
const { object } = require('webidl-conversions');
const food = require('../models/food');

const storage = multer.diskStorage({
  destination: './public/img',
//   filename: (req, file, cb) => {
//     cb(null, `${file.originalname}.${file.mimetype}`);
//   },
});

router.post('/addfood', multer({ storage: storage }).single('image'), async (req, res) => {
    try {

        const { name , price } = req.body ;

        const image = req.file.filename ; 

        const newfood = new Food({
            name,
            price,
            image
        })

        await newfood.save() ;

        res.redirect('/admin');
    } catch {
        res.status(500).json({
            message: 'Error adding food',
            error,
        });
    }
})

router.delete('/deletefood/:id' , async  (req,res,next) => {
    try { 
        const {id} = req.params;

        // console.log(id)
        await Food.findByIdAndDelete(id);

        res.redirect('/admin')
    } catch {

    }
})

// buyfood 

router.post('/buyorder/:id', async ( req, res, next) => {
    if (!req.session.logged ) return res.redirect('/')
    try {
        const {id}  = req.params ;
        const {count} = req.body ;
        const item = await Food.findById(id) ;

        const add = new Order({
            name : item.name ,
            count : Number(count) ,
            pay : Number(count) * item.price ,
            price : item.price ,
            id_user : req.session.user._id,
            address : req.session.user.address ,
            phone : req.session.user.phone ,
            email : req.session.user.email 
        })

        await add.save() ;

        res.redirect('/home')
        

    } catch (error) {
        console.log(error)
    }
})


router.post('/editfood/:id', multer({ storage: storage }).single('image'), async (req ,res ,next) => {

    try {
       
        const img = req.file ;

        const {name ,price} = req.body ;

        const {id} = req.params ;
        
        const data = [
            ['name',name] ,
            ['price',price],
            ['image',img != null ? img.filename : ''] 
        ]

        const object = data.reduce((object , [i,v]) => {
            if (v.length > 0) {
                object[i] = v ;
            }
            return object ; 
        },{})

        await Food.updateOne({ _id: id }, object ); 

        res.redirect('/admin') ;

    } catch {
        console.log('error') ;
    }
    
})

// cancel orders 

router.post('/cancelorder/:id',async ( req , res) => {
    try {
        const {id} = req.params ;

        const order = await Order.findByIdAndDelete(id)
        res.redirect('/myorder')

    } catch (err) {
        console.log(err)
    }
})

// confirm order 
router.post('/confirmorder/:id', async  ( req, res) => {
    try {
        const {id} = req.params ;

        const orders = await Order.updateMany({ id_user: id, stuts: "order" }, { stuts: "pedding" });

        res.redirect('/myorder')
    } catch (error) {
        console.log(error)
    }
})

// change stuts 
router.post('/orderstuts/:id', async ( req, res) => {
    try {

        const {id } = req.params ;

        const order = await Order.findById(id) ;

        if (order.stuts == 'pedding') {
            await Order.findByIdAndUpdate(id,{stuts : "doing"})
        }else {
            await Order.findByIdAndUpdate(id,{stuts : "success"})
        }

        res.redirect('/orders')
    } catch (err) {
        console.log(err)
    }
})

// editprofile 

router.post('/editprofile/:id' , async ( req, res) => {
    try {
        const {id}  = req.params ;
        const {password , confirmpassword , phone ,address} = req.body ;

        if (password.length > 0 && confirmpassword.length > 0 && password != confirmpassword) {
            return res.redirect('/home')
        }
        
        const local = req.session.user ;

        const user = await User.findByIdAndUpdate(id,{
            // firstname : ( firstname.length > 0 ? firstname : local.firstname) ,
            password : ( (password.length > 0 && password === confirmpassword) ? password : local.password) ,
            phone : ( phone.length > 0 ? phone : local.phone) ,
            address : ( address.length > 0 ? address : local.address) ,
        })

        if (user ) {
            req.session.user = user;
            console.log('wokr') ;
            res.redirect('/home')
        }

    } catch (error) {
        console.log(error)
    }
})

// register 
router.post('/register', async (req ,res) => {
    try {
        const {email,password,confirmpassword,address,phone} = req.body ;

        if (password != confirmpassword) {
            res.redirect('/')
            next() ;
        }
        const newuser = new User({
            email : email ,
            password :  password ,
            address : address ,
            phone : phone 
        })

        await newuser.save() ;

        res.redirect('/') ;

    } catch {
        console.log('error') ;
    }
})

// login 
router.post('/login',async ( req, res ) => {
    try {
        const {email , password} = req.body ;

        const user = await User.findOne({ email, password });

        if (user) {
            req.session.logged = true ;
            req.session.user = user ;

            if (user.email == 'admin@gmail.com') {
                req.session.admin = true ;
            }

            res.redirect('/home')
        }else {
            res.redirect('/')
        }
    } catch { 
        console.log('error')
    }
})


// logout ;

router.post('/logout',  ( req, res) => {
    req.session.user = {} ;
    req.session.logged = false ;
    req.session.admin = false ;
    res.redirect('/')
})

module.exports = router ;