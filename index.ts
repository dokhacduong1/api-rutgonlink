import express from "express";
import routesVersion1 from "./api/v1/router/index.routes";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
const app = express();
//Cấu hình để nhận data body khi request
app.use(bodyParser.json({ limit: "50mb" }));

app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "DELETE", "PUT", "PATCH", "OPTIONS"],
  })
);
//Import cấu hình file .env
dotenv.config();
//Lấy port trong file env hoặc ko có mặc định cổng 3000
const port: number | string = process.env.PORT || 2709;

//Nhúng app client của routes vào index
routesVersion1(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
