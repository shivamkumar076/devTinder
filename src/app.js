const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const port = process.env.PORT || 3000;
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// configure router
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/requests"));
app.use("/", require("./routes/user"));
mongoose
  .connect(process.env.MONGODB_DATABASE_URL)
  .then(() => {
    console.log("database connected sucessfully");
    app.listen(port, () => {
      console.log(`server is listen port ${port}`);
    });
  })
  .catch((err) => {
    console.error("mongodb connection err", err);
  });
