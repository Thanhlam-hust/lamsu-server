const Table = require('../../models/table.model');
const Branch = require('../../models/branch.model');
const Auth = require('../../models/auth.model');

const {
    ConflictError,
    NotFoundError,
    BadRequestError
} = require('../../core/error.response');

const K = require('../../common/k');


// ===============================
// LẤY DANH SÁCH BÀN
// ===============================
const getTables = async ({ requester, branchId }) => {

    let query = {};

    // ADMIN
    if (requester.role === 'admin') {

        // Admin có thể xem tất cả
        // Nếu truyền branchId thì lọc theo chi nhánh
        if (branchId) {
            query.branchId = branchId;
        }

    }

    // MANAGER
    else if (requester.role === 'manager') {

        const user = await Auth.findById(requester.idUser);

        if (!user) {
            throw new NotFoundError({
                message: 'Không tìm thấy tài khoản.',
                code: K.CODE_DATA_NOT_FOUND
            });
        }

        if (!user.branchId) {
            throw new BadRequestError({
                message: 'Quản lý chưa được gán vào chi nhánh.',
                code: K.CODE_UNAUTHORIZED_ACTION
            });
        }

        // Manager chỉ được xem bàn của chi nhánh mình
        query.branchId = user.branchId;

    }

    else {
        throw new BadRequestError({
            message: 'Bạn không có quyền xem danh sách bàn.',
            code: K.CODE_UNAUTHORIZED_ACTION
        });
    }

    return await Table.find(query)
        .populate('branchId', 'branchCode name')
        .sort({ tableNumber: 1 });
};


// ===============================
// THÊM BÀN
// ===============================
const createTable = async ({
    tableNumber,
    capacity,
    status,
    branchId,
    requester
}) => {

    let targetBranchId;

    // ===============================
    // ADMIN
    // ===============================
    if (requester.role === 'admin') {

        if (!branchId) {
            throw new BadRequestError({
                message: 'Vui lòng cung cấp branchId.',
                code: K.CODE_MISSING_DATA
            });
        }

        targetBranchId = branchId;
    }

    // ===============================
    // MANAGER
    // ===============================
    else if (requester.role === 'manager') {

        const user = await Auth.findById(requester.idUser);

        if (!user) {
            throw new NotFoundError({
                message: 'Không tìm thấy tài khoản.',
                code: K.CODE_DATA_NOT_FOUND
            });
        }

        if (!user.branchId) {
            throw new BadRequestError({
                message: 'Quản lý chưa được gán vào chi nhánh.',
                code: K.CODE_UNAUTHORIZED_ACTION
            });
        }

        // QUAN TRỌNG:
        // Không lấy branchId từ request của manager
        targetBranchId = user.branchId;

    }

    else {
        throw new BadRequestError({
            message: 'Bạn không có quyền thêm bàn.',
            code: K.CODE_UNAUTHORIZED_ACTION
        });
    }


    // Kiểm tra chi nhánh tồn tại
    const branch = await Branch.findById(targetBranchId);

    if (!branch) {
        throw new NotFoundError({
            message: 'Chi nhánh không tồn tại.',
            code: K.CODE_DATA_NOT_FOUND
        });
    }


    // Kiểm tra bàn trùng trong cùng chi nhánh
    const existingTable = await Table.findOne({
        tableNumber,
        branchId: targetBranchId
    });

    if (existingTable) {
        throw new ConflictError({
            message: 'Số bàn này đã tồn tại trong chi nhánh.',
            code: K.CODE_DATA_EXISTS
        });
    }


    const newTable = await Table.create({
        tableNumber,
        capacity,
        status: status || 'available',
        branchId: targetBranchId
    });

    return await Table.findById(newTable._id)
        .populate('branchId', 'branchCode name');
};


// ===============================
// SỬA BÀN
// ===============================
const updateTable = async ({
    id,
    tableNumber,
    capacity,
    status,
    branchId,
    requester
}) => {

    const table = await Table.findById(id);

    if (!table) {
        throw new NotFoundError({
            message: 'Không tìm thấy bàn.',
            code: K.CODE_DATA_NOT_FOUND
        });
    }


    // ===============================
    // MANAGER
    // ===============================
    if (requester.role === 'manager') {

        const user = await Auth.findById(requester.idUser);

        if (!user) {
            throw new NotFoundError({
                message: 'Không tìm thấy tài khoản.',
                code: K.CODE_DATA_NOT_FOUND
            });
        }

        if (!user.branchId) {
            throw new BadRequestError({
                message: 'Quản lý chưa được gán vào chi nhánh.',
                code: K.CODE_UNAUTHORIZED_ACTION
            });
        }

        // Manager chỉ được sửa bàn của chi nhánh mình
        if (table.branchId.toString() !== user.branchId.toString()) {
            throw new BadRequestError({
                message: 'Bạn chỉ có quyền chỉnh sửa bàn của chi nhánh mình.',
                code: K.CODE_UNAUTHORIZED_ACTION
            });
        }

        // Manager KHÔNG được chuyển bàn sang branch khác
        if (
            branchId !== undefined &&
            branchId.toString() !== user.branchId.toString()
        ) {
            throw new BadRequestError({
                message: 'Bạn không thể chuyển bàn sang chi nhánh khác.',
                code: K.CODE_UNAUTHORIZED_ACTION
            });
        }
    }

    // Chỉ admin hoặc manager mới đến được đây
    if (
        requester.role !== 'admin' &&
        requester.role !== 'manager'
    ) {
        throw new BadRequestError({
            message: 'Bạn không có quyền chỉnh sửa bàn.',
            code: K.CODE_UNAUTHORIZED_ACTION
        });
    }


    // Kiểm tra số bàn trùng
    if (tableNumber !== undefined) {

        const existingTable = await Table.findOne({
            tableNumber,
            branchId: table.branchId,
            _id: { $ne: id }
        });

        if (existingTable) {
            throw new ConflictError({
                message: 'Số bàn này đã tồn tại trong chi nhánh.',
                code: K.CODE_DATA_EXISTS
            });
        }

        table.tableNumber = tableNumber;
    }


    if (capacity !== undefined) {
        table.capacity = capacity;
    }

    if (status !== undefined) {
        table.status = status;
    }


    // Chỉ ADMIN mới có thể chuyển bàn sang branch khác
    if (
        requester.role === 'admin' &&
        branchId !== undefined
    ) {

        const branch = await Branch.findById(branchId);

        if (!branch) {
            throw new NotFoundError({
                message: 'Chi nhánh không tồn tại.',
                code: K.CODE_DATA_NOT_FOUND
            });
        }

        table.branchId = branchId;
    }


    await table.save();

    return await Table.findById(table._id)
        .populate('branchId', 'branchCode name');
};


module.exports = {
    getTables,
    createTable,
    updateTable
};