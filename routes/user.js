const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const Users = require('../models/users')
const Product = require('../models/items')
const History = require('../models/history');

// Buy
router.post('/buy/:id', async (req, res, next) => {

    const Item = await Product.findById(req.params.id);

    const local = req.session;

    if (local.cost <= 0) return res.redirect('/sneakers') ;

    if (local.cost < Item.price || Item.count <= 0) {
        
        res.redirect('/sneakers');

        // console.log(local.cost , Item.price , Item.count)
    }

    await Product.findByIdAndUpdate(Item._id, { count: Item.count - 1 })

    await Users.findByIdAndUpdate(local._id, { "info.cost": local.cost - Item.price });

    const addhistory = new History({
        email: local.email,
        item: Item.name,
        price: Item.price,
        itemid: Item._id
    })
    req.session.cost = local.cost - Item.price;

    await addhistory.save() ;

    res.redirect('/sneakers');


})

module.exports = router 