"use strict";
const bcrypt = require("bcrypt");

exports.encrypt = async (plain) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plain, 10, function (err, hash) {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });
};

exports.decrpyt = async (plainText, encrypted) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainText, encrypted, function (err, r) {
      if (err) {
        reject(err);
      }
      if (!r) {
        reject(new Error("Password not matched"));
      }
      resolve(r);
    });
  });
};
