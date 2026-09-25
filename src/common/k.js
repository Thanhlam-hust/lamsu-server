const K = Object.freeze({
    STATUS_OK: 200,
    STATUS_BAD_REQUEST: 400,
    STATUS_UNAUTHORIZED: 401,
    STATUS_FORBIDDEN: 403,
    STATUS_NOT_FOUND: 404,
    STATUS_CONFLICT: 409,
    STATUS_INTERNAL_SERVER_ERROR: 500,

    // --- MÃ LỖI NỘI BỘ (APP CODES) ---
    CODE_MISSING_DATA: 1,        // Thiếu dữ liệu đầu vào
    CODE_INVALID_FORMAT: 2,      // Dữ liệu không đúng định dạng
    CODE_DATA_EXISTS: 3,         // Dữ liệu đã tồn tại (vd: email trùng)
    CODE_DATA_NOT_FOUND: 4,      // Không tìm thấy dữ liệu
    CODE_WRONG_PASSWORD: 5,      // Sai mật khẩu
    CODE_TOKEN_EXPIRED: 6,       // Token hết hạn
    CODE_TOKEN_INVALID: 7,       // Token không hợp lệ
    CODE_UNAUTHORIZED_ACTION: 8, // Không có quyền thực hiện hành động (Phân quyền)
    CODE_SYSTEM_MAINTENANCE: 9,  // Hệ thống đang bảo trì
    CODE_SYSTEM_ERROR: 10,       // Hệ thống lỗi

    // --- DANH SÁCH ROLE ---
    ROLES: ['admin', 'manager', 'staff', 'guest']
});

module.exports = K;