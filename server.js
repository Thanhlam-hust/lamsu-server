const express = require('express');
const mongoose = require('mongoose');
const route = require('./src/router/main.router');
const os = require('os');
const http = require('http');
const cors = require('cors');
const path = require('path');
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const K = require('./src/common/k');


mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lamsudatabase')
  .then(() => {
    console.log('✅ Đã kết nối MongoDB');
  })
  .catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

if (fs.existsSync('./swagger-output.json')) {
  const swaggerFile = require('./swagger-output.json');
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1
    }
  }));
}

route(app);
app.use((err, _, res, __) => {
  const statusCode = err.statusCode || 500;
  const response = {
    status: 'error',
    code: K.CODE_SYSTEM_ERROR,
    message: err.message || 'Lỗi hệ thống'
  };
  if (err.code !== undefined && err.code !== null) {
    response.code = err.code;
  }
  return res.status(statusCode).json(response);
});

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (let name in interfaces) {
    for (let iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

const IP = getLocalIP();
server.listen(PORT, IP, () => {
  console.log(`🚀 Server chạy tại http://${IP}:${PORT}`);
});