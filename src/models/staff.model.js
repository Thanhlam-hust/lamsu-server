const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
    {
        // Họ và tên nhân viên
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        // Số điện thoại liên hệ
        numberPhone: {
            type: String,
            required: true,
            trim: true,
        },
        // Email (có thể không bắt buộc)
        email: {
            type: String,
            trim: true,
            default: null,
        },
        // Chi nhánh mà nhân viên này làm việc
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch',
            required: true,
        },
        // Vị trí/Chức vụ
        position: {
            type: String,
            enum: ['waiter', 'cashier', 'chef'],
            default: 'waiter',
        },
        // Mức lương (lương cơ bản)
        salary: {
            type: Number,
            default: 0,
        },
        // Ngày bắt đầu làm việc
        hireDate: {
            type: Date,
            default: Date.now,
        },
        // Số CCCD / CMND
        cccd: {
            type: String,
            trim: true,
            default: null,
        },
        // Địa chỉ thường trú / tạm trú
        address: {
            type: String,
            trim: true,
            default: null,
        },
        // Ngày tháng năm sinh
        dateOfBirth: {
            type: Date,
            default: null,
        },
        // Trạng thái (đang làm, nghỉ việc...)
        status: {
            type: String,
            enum: ['active', 'inactive', 'resigned'],
            default: 'active',
        },
        // Ghi chú thêm về nhân viên (vd: thái độ tốt, ca làm việc...)
        notes: {
            type: String,
            default: null,
        }
    },
    {
        timestamps: true,
        collection: 'staffs',
    }
);

// Format lại JSON khi trả về cho Client
staffSchema.set('toJSON', {
    transform: function (_, ret, _) {
        ret.idStaff = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Staff', staffSchema);
