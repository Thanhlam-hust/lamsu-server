const mongoose = require('mongoose');
const K = require('../../common/k');

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
        enum: K.ROLES,
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
    status: { type: String, default: 'active', enum: ['active', 'inactive'] },
    refreshToken: { type: String },
}, {
    timestamps: true,
    collection: 'auth'
});

// Thiết lập tự động xóa các trường nhạy cảm khi trả về JSON cho client
authSchema.set('toJSON', {
    transform: function (_, ret, _) {
        ret.idUser = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Auth', authSchema);