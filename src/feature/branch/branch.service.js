const Branch = require('../../models/branch.model');
const Auth = require('../../models/auth.model');
const authService = require('../auth/auth.service');

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

const getAllBranches = async (queryStatus) => {
    let filter = {};
    if (queryStatus) {
        filter.status = queryStatus;
    }
    const branches = await Branch.find(filter).sort({ createdAt: -1 }).populate('managerId');
    return branches.map(branch => {
        const branchJson = branch.toJSON();
        const managerObj = branchJson.managerId;
        
        if (managerObj && typeof managerObj === 'object') {
            branchJson.manager = managerObj;
            branchJson.managerId = managerObj.idUser || managerObj._id;
        } else {
            branchJson.manager = null;
        }
        
        return branchJson;
    });
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

const updateBranchStatus = async (id, status) => {
    const updatedBranch = await Branch.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedBranch) {
        throw new NotFoundError({
            message: 'Không tìm thấy chi nhánh.',
            code: K.CODE_DATA_NOT_FOUND
        });
    }

    // Cascade update status for employees and manager
    await Auth.updateMany({ branchId: id }, { status });

    return updatedBranch;
};


const getBranchEmployees = async (branchId) => {
    let query = { role: { $nin: ['manager', 'admin'] } };
    
    if (branchId) {
        const branch = await Branch.findById(branchId);
        if (!branch) {
            throw new NotFoundError({
                message: 'Không tìm thấy chi nhánh.',
                code: K.CODE_DATA_NOT_FOUND
            });
        }
        query.branchId = branchId;
    }

    return await Auth.find(query).select('-password');
};
module.exports = {
    createBranch,
    getAllBranches,
    updateBranch,
    updateBranchStatus,
    getBranchEmployees
};
