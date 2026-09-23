const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    // Thông tin đăng nhập
    username: { type: String, unique: true, sparse: true }, // Cần thiết cho máy tính bảng tại bàn
    email: {
        type: String,
        unique: true,
        sparse: true,
        required: function () { return this.role !== 'guest'; }
    },
    password: { type: String, required: true },
    // Thông tin cá nhân
    displayName: { type: String, required: true },
    numberPhone: { type: String },
    // Phân quyền
    role: {
        type: String,
        enum: ['admin', 'manager', 'staff', 'guest'],
        default: 'staff',
        required: true
    },
    // Liên kết nghiệp vụ
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: function () { return this.role !== 'admin'; }
    },
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: function () { return this.role === 'guest'; }
    },
    // Trạng thái & Bảo mật
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String },
}, {
    timestamps: true,
    collection: 'auth'
});

// Thiết lập tự động xóa các trường nhạy cảm khi trả về JSON cho client
authSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.refreshToken;
        return ret;
    }
});

module.exports = mongoose.model('Auth', authSchema);