const tableService = require('./table.service.js');

const {
    SuccessResponse
} = require('../../core/success.response');

const {
    BadRequestError
} = require('../../core/error.response');

const K = require('../../common/k');


// ===============================
// GET TABLES
// ===============================
const getTables = async (req, res, next) => {

    try {

        const requester = req.user;

        const { branchId } = req.query;

        const tables = await tableService.getTables({
            requester,
            branchId
        });

        new SuccessResponse({
            message: 'Lấy danh sách bàn thành công',
            data: tables
        }).send(res);

    } catch (error) {
        next(error);
    }
};


// ===============================
// CREATE TABLE
// ===============================
const createTable = async (req, res, next) => {

    try {

        const requester = req.user;

        const {
            tableNumber,
            capacity,
            status,
            branchId
        } = req.body;


        if (
            tableNumber === undefined ||
            capacity === undefined
        ) {
            throw new BadRequestError({
                message: 'Vui lòng cung cấp tableNumber và capacity.',
                code: K.CODE_MISSING_DATA
            });
        }


        if (tableNumber <= 0) {
            throw new BadRequestError({
                message: 'Số bàn phải lớn hơn 0.',
                code: K.CODE_INVALID_FORMAT
            });
        }


        if (capacity <= 0) {
            throw new BadRequestError({
                message: 'Số lượng người của bàn phải lớn hơn 0.',
                code: K.CODE_INVALID_FORMAT
            });
        }


        const table = await tableService.createTable({
            tableNumber,
            capacity,
            status,
            branchId,
            requester
        });


        new SuccessResponse({
            message: 'Thêm bàn thành công',
            data: table
        }).send(res);

    } catch (error) {
        next(error);
    }
};


// ===============================
// UPDATE TABLE
// ===============================
const updateTable = async (req, res, next) => {

    try {

        const requester = req.user;

        const { id } = req.params;

        const {
            tableNumber,
            capacity,
            status,
            branchId
        } = req.body;


        const table = await tableService.updateTable({
            id,
            tableNumber,
            capacity,
            status,
            branchId,
            requester
        });


        new SuccessResponse({
            message: 'Cập nhật bàn thành công',
            data: table
        }).send(res);

    } catch (error) {
        next(error);
    }
};


module.exports = {
    getTables,
    createTable,
    updateTable
};