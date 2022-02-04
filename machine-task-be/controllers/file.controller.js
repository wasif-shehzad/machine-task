const User = require("../model/users.model");
const FileModel = require("../model/files.model");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const defaultResponse = require("../utils/defaultResponse");
const constants = require("../utils/constants");
const fs = require("fs");
const path = require("path");

exports.editFilePermission = catchAsync(async (req, res, next) => {
  let userId = req.user._id;
  let users = req.body.users;
  let fileId = req.body.file;

  console.log(req.body);

  let allowedListOfUser = [];
  allowedListOfUser.push(userId);
  for (let i = 0; i < users.length; i++) {
    allowedListOfUser.push(users[i].value);
  }

  const filePermissionUpdated = await FileModel.findByIdAndUpdate(fileId, {
    allowed_users: allowedListOfUser,
  });

  return defaultResponse().success(
    { message: constants.DATA_UPDATED },
    filePermissionUpdated,
    res,
    200
  );
});

exports.uploadFile = catchAsync(async (req, res, next) => {
  let userId = req.user._id;
  let users = JSON.parse(req.body.users);
  console.log("file", req.file);
  const { originalname, filename, size } = req.file;
  let extension = originalname.split(".")[1];

  let allowedListOfUser = [];
  allowedListOfUser.push(userId);
  for (let i = 0; i < users.length; i++) {
    allowedListOfUser.push(users[i].value);
  }
  //allowedListOfUser = users.map((user) => user.value);

  let body = {
    file_name: filename,
    original_file_name: originalname,
    type: extension,
    size: size,
    owner: userId,
    allowed_users: allowedListOfUser,
  };
  const fileCreated = await FileModel.create(body);

  return defaultResponse().success(
    { message: constants.DATA_SAVED },
    fileCreated,
    res,
    201
  );
});

exports.checkFilePermission = catchAsync(async (req, res, next) => {
  let userid = req.user._id;
  let { file } = req.body;

  const checkIfUserisFileOwner = await FileModel.findOne({
    _id: file,
  }).populate({
    path: "allowed_users",
    match: { _id: { $eq: userid } },
  });

  console.log("checkuser", checkIfUserisFileOwner);
  if (checkIfUserisFileOwner?.allowed_users?.length > 0) {
    return defaultResponse().success(
      { message: constants.DATA_RETRIEVED },
      { message: "User has permission to see the file", code: 200 },
      res,
      200
    );
  } else {
    return next(
      new AppError("You don't have a permission to access file", 403)
    );
  }
});

exports.getFile = catchAsync(async (req, res, next) => {
  let { fileName } = req.body;

  var filePath = path.join(__basedir, "/uploads/" + fileName);
  console.log(filePath);
  var readStream = fs.createReadStream(filePath);

  readStream.pipe(res);

  // This line opens the file as a readable stream
});

exports.getAll = catchAsync(async (req, res, next) => {
  const getAllFiles = await FileModel.find({}).populate("owner allowed_users");
  return defaultResponse().success(
    { message: constants.DATA_RETRIEVED },
    getAllFiles,
    res,
    200
  );
});
