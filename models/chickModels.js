const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    chicksNum: {
        type: Number,
        required: true,
    },
    typeChicks: {
        type: String,
        required: true,
    },
    farmerType: {
        type: String,
        required: true,
        enum: ['starter', 'returning'],
    },
    unitPrice: {
        type: Number,
        require: true
    },
    totalPrice: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'dispatched', 'canceled'],
        default: 'pending',
    },
    approvedDate: Date
});
module.exports = mongoose.model("chickStock", requestSchema) 