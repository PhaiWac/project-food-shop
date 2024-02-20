const {  mongoose } = require("mongoose");

const foods_db = new mongoose.Schema({
    name : {
        type : String ,
        reqiured : true 
    },
    price : {
        type : Number ,
        reqiured : true 
    },
    image : {
        type : String ,
        reqiured : true 
    }
    // date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('foods', foods_db);

