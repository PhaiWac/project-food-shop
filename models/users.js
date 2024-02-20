const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        default: 0
    },
    address: {
        type: String,
    },
    phone: {
        type: Number
    }
   
});

const User = mongoose.model('users', userSchema);

module.exports = User;
