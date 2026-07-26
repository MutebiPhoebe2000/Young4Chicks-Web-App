const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    farmName: {
        type: String,
        required: true,
        trim: true
    },
    ownerName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    leadSource: {
        type: String,
        required: true,
        enum: ['Referral', 'Website', 'Social Media', 'Cold Call', 'Event']
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Converted', 'Lost'],
        default: 'New'
    },
    salesRep: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
