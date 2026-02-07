import express from "express";
import dotenv from "dotenv";
import dbConnection from "./configurations/model/connect.js";
import userRouter from "./routes/authentication/router.js";
import aiRouter from "./routes/ai/router.js"
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use("/user", userRouter);
app.use("/ai", aiRouter);
app.get("/", (req, res) => {
    res.send("hello world");
});
dbConnection();
app.listen(4000, () => {
  console.log("app listed to port 4000");
});
