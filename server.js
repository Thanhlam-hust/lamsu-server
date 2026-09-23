require('dotenv').config();
const express = require("express");
const connectDatabase = require("./src/config/database");

// Require routers
const registerRouter = require("./src/feature/register/register.router");

const app = express();

// Middleware để parse body JSON
app.use(express.json());

// Kết nối tới Database
connectDatabase().catch(err => console.error("Không thể kết nối database:", err));

// Khai báo các Routes
app.use('/api/auth', registerRouter);

// Base route kiểm tra server
app.get('/', (req, res) => {
    res.json({ message: "Hello API!" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://192.168.4.102:${PORT}`);
});