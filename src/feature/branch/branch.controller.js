const branchService = require('./branch.service');
const { SuccessResponse } = require('../../core/success.response');
const { BadRequestError } = require('../../core/error.response');
const K = require('../../common/k');

const createBranch = async (req, res, next) => {
    try {
        const requester = req.user;
        if (requester.role !== 'admin') {
            throw new BadRequestError({
                message: 'Chỉ Admin mới có quyền tạo chi nhánh.',
                code: K.CODE_UNAUTHORIZED_ACTION
            });
        }

        const {
            branchCode,
            name,
            phone,
            address,
            province,
            ward,
            location,
            openingTime,
            closingTime,
            managerId,
            description,
            status
        } = req.body;

        if (!branchCode || !name || !address) {
            throw new BadRequestError({
                message: 'Vui lòng cung cấp đầy đủ branchCode, name và address.',
                code: K.CODE_MISSING_DATA
            });
        }
        const newBranch = await branchService.createBranch({
            branchCode,
            name,
            phone,
            address,
            province,
            ward,
            location,
            openingTime,
            closingTime,
            managerId,
            description,
            status
        });
        new SuccessResponse({
            message: 'Tạo chi nhánh thành công',
            data: newBranch
        }).send(res);
    } catch (error) {
        next(error);
    }
};

const getAllBranches = async (req, res, next) => {
    try {
        const { status } = req.query;
        const branches = await branchService.getAllBranches(status);
        new SuccessResponse({
            message: 'Lấy danh sách chi nhánh thành công',
            data: branches
        }).send(res);
    } catch (error) {
        next(error);
    }
};

const updateBranch = async (req, res, next) => {
    try {
        const { id } = req.params;
        const requester = req.user;

        if (requester.role === 'manager') {
            const Auth = require('../../models/auth.model');
            const user = await Auth.findById(requester.idUser);
            if (!user.branchId || user.branchId.toString() !== id) {
                const { BadRequestError } = require('../../core/error.response');
                throw new BadRequestError({
                    message: 'Bạn chỉ có quyền cập nhật chi nhánh của mình.',
                    code: K.CODE_UNAUTHORIZED_ACTION
                });
            }
        } else if (requester.role !== 'admin') {
            const { BadRequestError } = require('../../core/error.response');
            throw new BadRequestError({
                message: 'Bạn không có quyền cập nhật chi nhánh.',
                code: K.CODE_UNAUTHORIZED_ACTION
            });
        }

        const {
            branchCode,
            name,
            phone,
            address,
            province,
            ward,
            location,
            openingTime,
            closingTime,
            managerId,
            description,
            status
        } = req.body;
        
        const payload = {
            branchCode,
            name,
            phone,
            address,
            province,
            ward,
            location,
            openingTime,
            closingTime,
            managerId,
            description,
            status
        };
        
        // Loại bỏ các trường undefined để Mongoose không bị đè dữ liệu
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        const updatedBranch = await branchService.updateBranch(id, payload);
        new SuccessResponse({
            message: 'Cập nhật chi nhánh thành công',
            data: updatedBranch
        }).send(res);
    } catch (error) {
        next(error);
    }
};

const updateBranchStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const requester = req.user;

        if (!['active', 'inactive'].includes(status)) {
            const { BadRequestError } = require('../../core/error.response');
            throw new BadRequestError({ message: 'Trạng thái không hợp lệ.' });
        }

        if (requester.role === 'manager') {
            const Auth = require('../../models/auth.model');
            const user = await Auth.findById(requester.idUser);
            if (!user.branchId || user.branchId.toString() !== id) {
                const { BadRequestError } = require('../../core/error.response');
                throw new BadRequestError({
                    message: 'Bạn chỉ có quyền cập nhật chi nhánh của mình.',
                    code: K.CODE_UNAUTHORIZED_ACTION
                });
            }
        } else if (requester.role !== 'admin') {
            const { BadRequestError } = require('../../core/error.response');
            throw new BadRequestError({
                message: 'Bạn không có quyền cập nhật chi nhánh.',
                code: K.CODE_UNAUTHORIZED_ACTION
            });
        }

        const updatedBranch = await branchService.updateBranchStatus(id, status);
        new SuccessResponse({
            message: 'Cập nhật trạng thái chi nhánh thành công',
            data: updatedBranch
        }).send(res);
    } catch (error) {
        next(error);
    }
};

const getBranchEmployees = async (req, res, next) => {
    try {
        const requester = req.user;
        let branchIdToQuery = null;

        if (requester.role === 'admin') {
            // Admin có thể xem tất cả nhân viên (không giới hạn chi nhánh)
            branchIdToQuery = null;
        } else if (requester.role === 'manager') {
            // Lấy thông tin user hiện tại để xem thuộc chi nhánh nào
            const Auth = require('../../models/auth.model');
            const user = await Auth.findById(requester.idUser);
            if (!user.branchId) {
                const { BadRequestError } = require('../../core/error.response');
                throw new BadRequestError({ 
                    message: 'Quản lý này chưa được gán vào chi nhánh nào.',
                    code: K.CODE_UNAUTHORIZED_ACTION
                });
            }
            branchIdToQuery = user.branchId;
        } else {
            const { BadRequestError } = require('../../core/error.response');
            throw new BadRequestError({ 
                message: 'Không có quyền truy cập danh sách nhân viên.',
                code: K.CODE_UNAUTHORIZED_ACTION
            });
        }

        const employees = await branchService.getBranchEmployees(branchIdToQuery);

        new SuccessResponse({
            message: 'Lấy danh sách nhân viên thành công',
            data: employees
        }).send(res);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBranch,
    getAllBranches,
    updateBranch,
    updateBranchStatus,
    getBranchEmployees
};


