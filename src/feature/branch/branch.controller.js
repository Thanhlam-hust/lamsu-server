const branchService = require('./branch.service');
const { SuccessResponse } = require('../../core/success.response');
const { BadRequestError } = require('../../core/error.response');
const K = require('../../common/k');

const createBranch = async (req, res, next) => {
    try {
        const { branchCode, name, address, ...otherFields } = req.body;
        if (!branchCode || !name || !address) {
            throw new BadRequestError({
                message: 'Vui lòng cung cấp đầy đủ branchCode, name và address.',
                code: K.CODE_MISSING_DATA
            });
        }
        const newBranch = await branchService.createBranch({
            branchCode,
            name,
            address,
            ...otherFields
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
        const branches = await branchService.getAllBranches();
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
        const updatedBranch = await branchService.updateBranch(id, req.body);
        new SuccessResponse({
            message: 'Cập nhật chi nhánh thành công',
            data: updatedBranch
        }).send(res);
    } catch (error) {
        next(error);
    }
};

const deleteBranch = async (req, res, next) => {
    try {
        const { id } = req.params;
        await branchService.deleteBranch(id);
        new SuccessResponse({
            message: 'Xoá chi nhánh thành công',
            data: null
        }).send(res);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBranch,
    getAllBranches,
    updateBranch,
    deleteBranch
};
