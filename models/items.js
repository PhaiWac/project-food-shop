const { default: mongoose } = require("mongoose");

const ItemsSchema = new mongoose.Schema({
    name : String ,
    price : Number ,
    image : String ,
    count : Number 
})

const Items = mongoose.model('items', ItemsSchema);

Items.updateItemPrice = async function (itemId, newPrice) {
    try {
        const updateResult = await this.updateOne(
            { _id: itemId },
            { $set: { price: newPrice } }
        );

        if (updateResult.matchedCount > 0 && updateResult.modifiedCount > 0) {
            console.log('Price updated successfully.');
        } else {
            console.log('Item not found or price not updated.');
        }
    } catch (error) {
        console.error(error);
    }
};

module.exports = Items 