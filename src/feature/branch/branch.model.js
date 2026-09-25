const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema(
    {
        branchCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
            default: null,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        province: {
            type: String,
            trim: true,
            default: null,
        },
        ward: {
            type: String,
            trim: true,
            default: null,
        },
        location: {
            latitude: {
                type: Number,
                default: null,
            },
            longitude: {
                type: Number,
                default: null,
            },
        },
        openingTime: {
            type: String,
            default: null,
        },
        closingTime: {
            type: String,
            default: null,
        },
        managerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        status: {
            type: String,
            default: 'active',
            enum: ['active', 'inactive']
        },
    },
    {
        timestamps: true,
        collection: 'branches',
    }
);

branchSchema.set('toJSON', {
    transform: function (_, ret, _) {
        ret.idBranch = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Branch', branchSchema);
