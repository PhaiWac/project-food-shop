const { default: mongoose } = require("mongoose");

const HistorySchema = new mongoose.Schema({
    email : String ,
    item : String ,
    price : String ,
    itemid : mongoose.Schema.Types.Mixed ,
    // date: { type: Date, default: Date.now }
})

const history = mongoose.model('historys', HistorySchema);


module.exports = history // ประวัติ