const express = require("express");
const {
  signin,
  signout,
  signup,
  refreshToken,
} = require("./../controllers/userAuth.controller");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.get("/refresh-token", refreshToken);

module.exports = {
  userAuthRoutes: router,
};
