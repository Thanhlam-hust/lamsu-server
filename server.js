require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDatabase = require("./src/config/database");
const route = require("./src/router/main.router");

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

route(app);

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://192.168.4.108:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exitCode = 1;
  });
