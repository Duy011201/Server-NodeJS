import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import viewEngine from "./config/viewEngine.js";
import { connect } from "./config/connect.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import Constant from "./common/constant.js";

//  config app
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

viewEngine(app);
//  router
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);

connect();

const PORT = process.env.PORT || Constant.PORT_SECONDARY;
const server = app.listen(PORT, () => {
  console.log(`App listening on port ${server.address().port}`);
});
