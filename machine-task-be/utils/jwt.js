const jsonwebtoken = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

exports.signToken = (data, expiresIn = JWT_EXPIRES_IN) => {
  return jsonwebtoken.sign(data, JWT_SECRET, { expiresIn });
};

exports.verifyToken = (token, cb) => {
  jsonwebtoken.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) {
      cb(error, null);
    } else {
      cb(null, decoded);
    }
  });
};
