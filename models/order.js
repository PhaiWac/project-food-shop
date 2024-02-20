const {  mongoose } = require("mongoose");

const orders = new mongoose.Schema({
    
    name : {
        type : String ,
        reqiured : true 
    },
    price : {
        type : Number ,
        reqiured : true 
    },
    count : {
        type : Number ,
        reqiured : true ,
    },
    pay : {
        type : Number ,
        reqiured : true ,
    },
    id_user : {
        type : mongoose.Schema.Types.ObjectId,
        reqiured : true 
    },
    address : {
        type : String ,
        reqiured : true 
    },
    phone : {
        type : Number,
        reqiured : true 
    },
    email : {
        type : String ,
        reqiured : true 
    },
    stuts : {
        type : String ,
        default : "order"
    }
    // date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('orders', orders);

