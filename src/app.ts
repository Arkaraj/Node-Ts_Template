import express from "express";
import cors from "cors";
import morgan from "./logger/morgan";
require("dotenv-save").config();
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Connect to database here

// use all the middlewires
app.use(cookieParser());

// Logging
app.use(morgan);

//Importing routes
import userRoute from "./routes/user.routes";

//Routes
app.use("/api/users", userRoute);

app.get("/", (_req, res) => {
  res.send("Node ts Template");
});

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Listening on port ${port} 🚀`);
});
