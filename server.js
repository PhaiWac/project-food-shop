const express = require('express') 
const app = express() ;
const expressLayouts = require('express-ejs-layouts') 
const methodOverride = require('method-override');
const session = require('express-session') ;
require('dotenv').config();

// config view ejs 
app.set('view engine','ejs')
app.set('views',__dirname + '/views')
app.set('layout','layouts/layout') ;

//  config layout 
app.use(expressLayouts) 

// config default path
app.use(express.static('public')) 

// config use method 
app.use(methodOverride('_method'));


app.use(express.urlencoded({ extended: true }));

// session 

app.use(session({
    secret : 'admin' ,
    resave : true ,
    saveUninitialized : true 
}))

//  db 
const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URL)

const db = mongoose.connection;

// จัดการเหตุการณ์เมื่อมีการเชื่อมต่อเกิดขึ้น
db.on('error', console.error.bind(console, 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ MongoDB:'));
db.once('open', () => {
  console.log('เชื่อมต่อกับ MongoDB สำเร็จ');
});

app.listen(process.env.PORT || 3000 , () => {
    console.log('Server Started')
})


// Middle Ware

const Food = require('./models/food')
const User = require('./models/users')
const Order = require('./models/order')

// User Middle 

app.use('/admin', async (req,res,next) => {
  const allFoods = await Food.find();
  req.allFoods = allFoods;
  next();
})

app.use('/home' , async ( req ,res, next ) => {
  req.allfoods = await Food.find() ;
  next() ;
})

app.use('/myorder', async ( req, res, next) => {
  if (!req.session.logged) {
    return res.redirect('/')
  }
  req.orders = await Order.find({id_user : req.session.user._id , stuts : 'order'});
  next() ;
} )

app.use('/orders', async ( req, res , next) => {
  if (!req.session.logged) {
    return res.redirect('/')
  }
  req.orders = await Order.find({
    stuts: {
      $in: ['pedding', 'doing']
    }
  });
  next() ;
})

app.use('/history', async ( req ,res ,next) => {
  if (!req.session.logged) {
    return res.redirect('/')
  }
  req.orders = await Order.find({id_user : req.session.user._id});
  // const orders = await Order.find({
  //   id_user: req.session.user._id,
  // }).populate('user', 'address phone');
  // console.log(orders)
  next() ;
})

//  Use Route 

const indexRoutes = require('./routes/index') ;
const adminRoutes = require('./routes/admin') ;
const userRoters = require('./routes/user'); 
const apiRouters = require('./routes/api');

app.use('/',indexRoutes)

app.use('/admin',adminRoutes)

app.use('/user',userRoters)

app.use('/api',apiRouters)
