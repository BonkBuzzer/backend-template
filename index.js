require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const userRouter = require("./routes/user.routes");
const authRouter = require("./routes/auth.routes");
const auth = require("./middleware/auth");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

let PORT;
process.env.STATUS === "production"
  ? (PORT = process.env.PROD_PORT)
  : (PORT = process.env.DEV_PORT);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Mongo connected");
  })
  .catch((err) => console.error("Connection failed :", err));

app.use("/", authRouter);
// app.use("/", auth, userRouter);
app.use("/", userRouter);

app.get("/", async (_, res) => {
  res.json({ message: "Express + Javascript" });
});

app.listen(PORT, () => {
  console.log(
    `Server started running on port ${PORT} in ${process.env.STATUS} mode`
  );
});
