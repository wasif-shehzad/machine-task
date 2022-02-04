const jwt = require("jsonwebtoken");
require("dotenv").config();
const constants = require("../utils/constants");
const defaultResponse = require("../utils/defaultResponse");
const User = require("../model/users.model");
const errorCode = require("../utils/errorCodes");
const catchAsync = require("../utils/catchAsync");

const AppError = require("../utils/appError");

module.exports = catchAsync(async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, data) {
      if (err) {
        return next(new AppError(constants.TOKEN_ERROR, errorCode.NO_TOKEN));
      } else {
        User.findById(data.id, (error, user) => {
          if (error) {
            return next(
              new AppError(constants.TOKEN_ERROR, errorCode.NO_TOKEN)
            );
          } else {
            req.user = user;
            next();
          }
        });
      }
    });
  } else {
    return next(new AppError(constants.TOKEN_ERROR, errorCode.NO_TOKEN));
  }
});
