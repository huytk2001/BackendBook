const db = require("../config/database");
const util = require("util");
const query = util.promisify(db.query).bind(db);
const employerModel = require("../models/employer.model");
const { log } = require("console");

exports.index = async function (req, res) {
  try {
    employerModel.getAll(req, function (err, data, totalPage, _page, _name) {
      res.render("user", {
        title: "Quản lý danh mục",
        data: data ? data : [],
        totalPage: totalPage,
        _page: parseInt(_page),
        _name: _name,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi máy chủ nội bộ");
  }
};

exports.edit = function (req, res) {
  let id = req.params.id;
  employerModel.getOne(id, function (err, data) {
    if (err) {
      res.render("error", {
        message: err.msg,
        code: err.errno,
      });
    } else {
      res.render("user-edit", {
        cat: data,
      });
    }
  });
};
// employer.controllers.js

exports.editEmployer = async function (req, res) {
  let id = req.params.id;
  let newName = req.body.name;
  let bodyData = req.body;
  console.log(bodyData);
  console.log(req.file);

  if (req.file) {
    // If yes, add the file name to bodyData
    bodyData.image = req.file.filename;
  }

  try {
    let result = await employerModel.updateEmployer(id, bodyData);
    if (result) {
      res.render("user-edit", {
        cat: bodyData,
      });
    } else {
      res.render("error", {
        message: "Không thể cập nhật danh mục",
        code: 500,
      });
    }
  } catch (error) {
    console.error(error);
    res.render("error", {
      message: error.message,
      code: 500,
    });
  }
};

exports.delete = function (req, res) {
  let id = req.params.id;
  employerModel.delete(req, res, function (err, msg, data) {
    if (err) {
      res.render("error", {
        message: err.msg,
        code: err.errno,
      });
    } else {
      res.redirect("/user");
    }
  });
};

exports.create = function (req, res) {
  res.render("user-add");
};
