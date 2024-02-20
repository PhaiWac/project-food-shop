const express = require('express'); 
const { default: mongoose } = require('mongoose');
const router = express.Router() ;
const Users = require('../models/users')
const Product = require('../models/items')

const multer = require('multer')
  
router.get('/home',(req, res, next) => {
    res.render('adminhome',{session : req.session}) ;
})

router.get('/configuser' , async (req ,res , next) => {
    const result = await Users.find({}) 

    res.render('userconfig',{session : req.session , data : result})
})

router.get('/configitems', async (req , res , next) => {
    const result = await Product.find({}) 

    res.render('itemconfig',{session : req.session , data : result})
})

router.post('/addcost/:id' , async ( req, res , next ) => {
    const newcost = req.body.cost ;

    const add = await Users.updateOne({ _id : req.params.id }, { 
        $set: {
            'info.cost': Number(newcost)
        } 
    })

    if (add.modifiedCount > 0) {
        res.redirect('/admin/configuser')
    }

})

router.delete('/removeitem/:id' , async ( req , res , next) => {
    const ItemId = req.params.id ;

    try {
        const deleteitem = await Product.findByIdAndDelete(ItemId) ;

        if (!deleteitem) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.redirect('/admin/configitems')
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
})

router.delete('/removeuser/:id', async (req, res, next) => {
    const userId = req.params.id;

    try {
        const deletedUser = await Users.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.redirect('/admin/configuser')
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/img')
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname)
    },
  })
  
const upload = multer({ storage })

router.post('/addstock' , upload.single('image'), async (req, res) => {
    
    const data = {} ;
    let image = null ;

    if (req.file) {
        image = req.file.filename ;
        data['image'] = image ;
    }

    for (const index in req.body) {
        const value = req.body[index] ;
        data[index] = value ;
    }

    const add = new Product({ name : data.title , price : data.price , image : data.image , count : data.count })
    
    add.save()
    .then(() => res.redirect('/admin/configitems') )
    .catch(err => console.error('เกิดข้อผิดพลาด: ', err));
})

module.exports = router ;