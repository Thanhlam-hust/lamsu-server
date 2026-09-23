const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    branchCode: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    }, // Tương đương với ID riêng (Mã chi nhánh), ví dụ: 'CN01'
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, {
    timestamps: true,
    collection: 'branches' // Tên collection trong MongoDB
});

module.exports = mongoose.model('Branch', branchSchema);
