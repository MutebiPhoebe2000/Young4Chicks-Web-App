const mongoose = require('mongoose');

const feedsRequestSchema = new mongoose.Schema({
    farmerName: {
        type: String,
        required: true
    },
    farmerNIN: {
        type: String,
        // required: true
    },
    quantityFeeds: {
        type: Number,
        required: true
    },
    typeFeeds: {
        type: String,
        required: true
    },
    farmerType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Dispatched', 'Completed'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('feedsRequest', feedsRequestSchema);
