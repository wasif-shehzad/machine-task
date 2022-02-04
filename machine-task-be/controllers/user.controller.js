const { promisify } = require("util");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../model/users.model");
const jwt = require("../utils/jwt");
const serverCode = require("../utils/errorCodes");
const constants = require("../utils/constants");
const defaultResponse = require("../utils/defaultResponse");

const createSendToken = (user, expires_in, statusCode, res) => {
  const token = jwt.signToken({ id: user._id }, expires_in);
  // user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
      token,
    },
  });
};

exports.getAll = catchAsync(async (req, res, next) => {
  const userID = req.user._id;
  const users = await User.find({ _id: { $ne: userID } });
  return defaultResponse().success(
    { message: constants.DATA_RETRIEVED },
    users,
    res,
    200
  );
});

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const result = await User.findOne({ email: email });
  if (result !== null) {
    return defaultResponse().error(
      { message: constants.EMAIL_ALREADY_EXISTS },
      res,
      serverCode.ERROR
    );
  }

  const user = await User.create(req.body)
    .then((data) => {
      return defaultResponse().success(
        { message: constants.DATA_SAVED },
        data,
        res,
        201
      );
    })
    .catch((err) => {
      return defaultResponse().error({ message: err }, res, serverCode.ERROR);
    });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");
  // const user = await User.findOne({ email });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  let expires_in = "7d";

  // 3) If everything ok, send token to client
  createSendToken(user, expires_in, 200, res);
});

// exports.restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.profile)) {
//       return next(
//         new AppError("You do not have permission to perform this action", 403)
//       );
//     }

//     next();
//   };
// };
