const Branch = require('./branch.model');
const { ConflictError, NotFoundError } = require('../../core/error.response');
const K = require('../../common/k');

const createBranch = async (payload) => {
    const existingBranch = await Branch.findOne({ branchCode: payload.branchCode });
    if (existingBranch) {
        throw new ConflictError({
            message: 'Mã chi nhánh đã tồn tại.',
            code: K.CODE_DATA_EXISTS
        });
    }
    const newBranch = await Branch.create(payload);
    return newBranch;
};

const getAllBranches = async () => {
    return await Branch.find().sort({ createdAt: -1 });
};

const updateBranch = async (id, payload) => {
    // Nếu có đổi mã chi nhánh, kiểm tra trùng lặp
    if (payload.branchCode) {
        const existingBranch = await Branch.findOne({ branchCode: payload.branchCode, _id: { $ne: id } });
        if (existingBranch) {
            throw new ConflictError({
                message: 'Mã chi nhánh đã tồn tại ở một chi nhánh khác.',
                code: K.CODE_DATA_EXISTS
            });
        }
    }

    const updatedBranch = await Branch.findByIdAndUpdate(id, payload, { new: true });
    if (!updatedBranch) {
        throw new NotFoundError({
            message: 'Không tìm thấy chi nhánh.',
            code: K.CODE_DATA_NOT_FOUND
        });
    }
    return updatedBranch;
};

const deleteBranch = async (id) => {
    const deletedBranch = await Branch.findByIdAndDelete(id);
    if (!deletedBranch) {
        throw new NotFoundError({
            message: 'Không tìm thấy chi nhánh.',
            code: K.CODE_DATA_NOT_FOUND
        });
    }
    return deletedBranch;
};

module.exports = {
    createBranch,
    getAllBranches,
    updateBranch,
    deleteBranch
};
