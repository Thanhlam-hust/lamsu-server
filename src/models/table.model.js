const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
    {
        tableNumber: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['available', 'occupied', 'reserved', 'inactive'],
            default: 'available'
        },

        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch',
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Table', tableSchema);