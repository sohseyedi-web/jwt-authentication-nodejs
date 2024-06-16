const createError = require("http-errors");
const { User } = require("../models/user.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  setAccessToken,
  setRefreshToken,
  verifyRefreshToken,
} = require("../utils/functions.js");
const { signinSchema, signupSchema } = require("../validators/user.schema.js");

// register function
const signup = async (req, res, next) => {
  const { username, email, password, role } = req.body;
  await signupSchema.validateAsync(req.body);

  if (
    !username ||
    !email ||
    !password ||
    !role ||
    username === "" ||
    email === "" ||
    password === "" ||
    role === ""
  ) {
    throw createError.BadRequest("All fields are required");
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    role,
  });

  try {
    // get access_token when signup route
    await newUser.save();
    const validUser = await User.findOne({ email });
    const token = jwt.sign(
      { id: validUser._id, ...validUser },
      process.env.JWT_SECRET
    );
    await setAccessToken(res, validUser);
    await setRefreshToken(res, validUser);
    res.status(201).json({ message: "Signup successful", token });
  } catch (error) {
    next(error);
    console.log(error);
    throw createError.Unauthorized("Your registration failed.");
  }
};

// login function
const signin = async (req, res, next) => {
  const { email, password } = req.body;
  await signinSchema.validateAsync(req.body);
  if (!email || !password || email === "" || password === "") {
    throw createError.BadRequest("All fields are required");
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      throw createError.NotFound("User not found");
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      throw createError.BadRequest("Invalid password");
    }
    const token = jwt.sign(
      { id: validUser._id, ...validUser },
      process.env.JWT_SECRET
    );

    const { password: pass, ...user } = validUser._doc;
    await setAccessToken(res, validUser);
    await setRefreshToken(res, validUser);
    res.status(200).json({ message: "Login Successfully", user, token });
  } catch (error) {
    throw createError.Unauthorized("Login Failed.");
  }
};

// refreshToken function
const refreshToken = async (req, res) => {
  const userId = await verifyRefreshToken(req);
  const user = await User.findById(userId);
  await setAccessToken(res, user);
  await setRefreshToken(res, user);
  return res.status(200).json({
    StatusCode: 200,
    data: {
      user,
    },
  });
};

// log out function
const signout = (req, res, next) => {
  const cookieOptions = {
    maxAge: 1,
    expires: Date.now(),
    httpOnly: true,
    signed: true,
    sameSite: "Lax",
    secure: true,
    path: "/",
    domain:
      process.env.NODE_ENV === "development" ? "localhost" : ".example.ir",
  };
  res.cookie("accessToken", null, cookieOptions);
  res.cookie("refreshToken", null, cookieOptions);

  return res.status(200).json({
    StatusCode: 200,
    message: "LogOut successfully",
  });
};

module.exports = {
  signout,
  signin,
  signup,
  refreshToken,
};
