const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['local', 'exotic'],
        required: true,
    },
    chickType: {
        type: String,
        enum: ['broiler', 'layer', 'kuroiler'],
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    stockDate: {
        type: Date,
        required: true,
    }
});
module.exports = mongoose.model("stock", stockSchema)
