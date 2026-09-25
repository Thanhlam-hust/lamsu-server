const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Lamsu API Documentation',
    description: 'Tài liệu API cho Lamsu Server'
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Bearer Token'
    }
  },
  definitions: {
    RegisterResponse: {
      status: 'success',
      message: 'Đăng ký tài khoản thành công',
      data: {
        idUser: '6ab51fba...',
        email: 'user@example.com',
        displayName: 'Hải',
        numberPhone: '0123456789',
        role: 'admin',
        isActive: true,
        createdAt: '2026-09-24T09:50:50.958Z'
      },
      access_token: null,
      refresh_token: null
    },
    LoginResponse: {
      status: 'success',
      message: 'Đăng nhập thành công',
      data: {
        idUser: '6ab51fba...',
        email: 'user@example.com',
        displayName: 'Hải',
        numberPhone: '0123456789',
        role: 'admin',
        isActive: true
      },
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    },
    Branch: {
      idBranch: '6ab51fc...',
      branchCode: 'CN01',
      name: 'Chi nhánh Trung tâm',
      phone: '0901234567',
      address: '123 Đường ABC',
      province: 'Hà Nội',
      ward: 'Phường XYZ',
      location: {
        latitude: 21.028511,
        longitude: 105.804817
      },
      openingTime: '08:00',
      closingTime: '22:00',
      managerId: null,
      description: 'Chi nhánh chính',
      status: 'active',
      createdAt: '2026-09-24T09:50:50.958Z',
      updatedAt: '2026-09-24T09:50:50.958Z'
    },
    BranchResponse: {
      status: 'success',
      message: 'Tạo chi nhánh thành công',
      data: {
          $ref: '#/definitions/Branch'
      }
    },
    BranchListResponse: {
      status: 'success',
      message: 'Lấy danh sách chi nhánh thành công',
      data: [
        { $ref: '#/definitions/Branch' }
      ]
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./src/router/main.router.js'];

// Tạo file swagger-output.json
swaggerAutogen(outputFile, routes, doc);
