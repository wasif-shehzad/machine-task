const User = require("../model/users.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const defaultResponse = require("../utils/defaultResponse");
const constants = require("../utils/constants");

exports.verifyToken = catchAsync(async (req, res, next) => {
  console.log(req.user, "user");
  const userDetails = await User.findById(req.user._id);
  defaultResponse().success(
    { message: constants.DATA_RETRIEVED },
    userDetails,
    res,
    200
  );
});
