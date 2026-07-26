const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    farmerName: {
        type: String,
        required: true
    },
    farmerNIN: {
        type: String,
        // required: true
    },
    numChicks: {
        type: Number,
        required: true
    },
    typeChicks: {
        type: String,
        required: true
    },
    chickFeeds: {
        type: String
    },
    feedsQuantity: {
        type: Number
    },
    farmerType: {
        type: String,
        required: true
    },
    deliveryDate: {
        type: Date
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Dispatched', 'Completed'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('request', requestSchema);
