const Auth = require('../../model/auth.model');
const bcrypt = require('bcrypt');

const registerAdmin = async (req, res) => {
    try {
        const { email, numberPhone, displayName, password } = req.body;

        // 1. Kiểm tra đầu vào cơ bản
        if (!email || !password || !displayName) {
            return res.status(400).json({
                status: 'error',
                message: 'Vui lòng cung cấp đầy đủ email, password và displayName.',
                data: null
            });
        }

        // 2. Kiểm tra xem email đã tồn tại chưa
        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                status: 'error',
                message: 'Email này đã được sử dụng.',
                data: null
            });
        }

        // 3. Mã hóa mật khẩu (Hash password)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Tạo tài khoản Admin
        const newAdmin = await Auth.create({
            email,
            password: hashedPassword,
            displayName,
            numberPhone,
            role: 'admin' // Force role là admin theo yêu cầu
        });

        // 5. Trả về kết quả (password sẽ tự động bị ẩn do cấu hình toJSON ở Model)
        return res.status(201).json({
            status: 'success',
            message: 'Đăng ký tài khoản Admin thành công',
            data: newAdmin
        });

    } catch (error) {
        console.error('Lỗi khi đăng ký Admin:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Đã có lỗi xảy ra trên server',
            data: null
        });
    }
};

module.exports = {
    registerAdmin
};
