const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { userAuthRoutes } = require("./router/userAuth");

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY));
app.use(cors({ credentials: true, origin: process.env.ALLOW_CORS_ORIGIN }));
app.use("/api/auth", userAuthRoutes);

// mongoo db connect
mongoose
  .connect(process.env.URL_MONGODB)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

// server port
app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
