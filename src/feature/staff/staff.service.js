const Staff = require('../../models/staff.model');
const { ConflictError, NotFoundError } = require('../../core/error.response');
const K = require('../../common/k');

const createStaff = async (payload) => {
    // Check if phone number or CCCD is already used
    if (payload.numberPhone) {
        const existingStaff = await Staff.findOne({ numberPhone: payload.numberPhone });
        if (existingStaff) {
            throw new ConflictError({
                message: 'Số điện thoại này đã được đăng ký cho nhân viên khác.',
                code: K.CODE_DATA_EXISTS
            });
        }
    }

    if (payload.cccd) {
        const existingCccd = await Staff.findOne({ cccd: payload.cccd });
        if (existingCccd) {
            throw new ConflictError({
                message: 'CCCD/CMND này đã tồn tại trong hệ thống.',
                code: K.CODE_DATA_EXISTS
            });
        }
    }

    return await Staff.create(payload);
};

const updateStaff = async (id, payload, managerBranchId = null) => {
    const staff = await Staff.findById(id);
    if (!staff) {
        throw new NotFoundError({
            message: 'Không tìm thấy nhân viên.',
            code: K.CODE_DATA_NOT_FOUND
        });
    }

    // Nếu là manager thì chỉ sửa được nhân viên thuộc branch của mình
    if (managerBranchId && staff.branchId.toString() !== managerBranchId.toString()) {
        const { BadRequestError } = require('../../core/error.response');
        throw new BadRequestError({
            message: 'Nhân viên này không thuộc chi nhánh của bạn.',
            code: K.CODE_UNAUTHORIZED_ACTION
        });
    }

    // Check unique conflicts khi sửa
    if (payload.numberPhone && payload.numberPhone !== staff.numberPhone) {
        const existingStaff = await Staff.findOne({ numberPhone: payload.numberPhone, _id: { $ne: id } });
        if (existingStaff) {
            throw new ConflictError({
                message: 'Số điện thoại này đã được sử dụng bởi nhân viên khác.',
                code: K.CODE_DATA_EXISTS
            });
        }
    }

    if (payload.cccd && payload.cccd !== staff.cccd) {
        const existingCccd = await Staff.findOne({ cccd: payload.cccd, _id: { $ne: id } });
        if (existingCccd) {
            throw new ConflictError({
                message: 'CCCD/CMND này đã được sử dụng bởi nhân viên khác.',
                code: K.CODE_DATA_EXISTS
            });
        }
    }

    // Loại bỏ các field không được undefined
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    return await Staff.findByIdAndUpdate(id, payload, { new: true });
};

const updateStaffStatus = async (id, status, managerBranchId = null) => {
    const staff = await Staff.findById(id);
    if (!staff) {
        throw new NotFoundError({
            message: 'Không tìm thấy nhân viên.',
            code: K.CODE_DATA_NOT_FOUND
        });
    }

    if (managerBranchId && staff.branchId.toString() !== managerBranchId.toString()) {
        const { BadRequestError } = require('../../core/error.response');
        throw new BadRequestError({
            message: 'Nhân viên này không thuộc chi nhánh của bạn.',
            code: K.CODE_UNAUTHORIZED_ACTION
        });
    }

    staff.status = status;
    return await staff.save();
};

const getStaffs = async (query = {}) => {
    return await Staff.find(query).sort({ createdAt: -1 });
};

module.exports = {
    createStaff,
    updateStaff,
    updateStaffStatus,
    getStaffs
};
