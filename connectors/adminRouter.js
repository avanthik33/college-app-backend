const express = require("express");
const Hod = require("../models/hodModel");
const Admin = require("../models/adminModel");
const Student = require("../models/studentModel");
const Staff = require("../models/staffModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

//signin of Admin, Student, Hod and Staff
router.post("/signin", async (req, res) => {
  try {
    let input = req.body;
    let inputEmail = input.email;
    let inputPassword = input.password;
    let adminData = await Admin.findOne({ email: inputEmail });
    if (adminData) {
      if (adminData.password === inputPassword) {
        jwt.sign(
          { email: inputEmail, id: adminData._id },
          "collegeApp",
          { expiresIn: "2h" },
          (error, token) => {
            if (error) {
              res.json({
                status: "error",
                message: "Error signing token",
              });
            } else {
              res.json({
                status: "success",
                message: "Admin login success",
                data: adminData,
                token: token,
              });
            }
          }
        );
      } else {
        return res.json({
          status: "error",
          message: "Password is not correct",
        });
      }
    }

    let studentData = await Student.findOne({ email: inputEmail });
    if (studentData) {
      if (studentData.password === inputPassword) {
        jwt.sign(
          { email: inputEmail, id: studentData._id },
          "collegeApp",
          { expiresIn: "2h" },
          (error, token) => {
            if (error) {
              res.json({
                status: "error",
                message: "error signin token",
              });
            } else {
              res.json({
                status: "success",
                message: "Student login success",
                data: studentData,
                token: token,
              });
            }
          }
        );
      } else {
        return res.json({
          status: "error",
          message: "Password is not correct",
        });
      }
    }
    let staffData = await Staff.findOne({ email: inputEmail });
    if (staffData) {
      if (staffData.password === inputPassword) {
        jwt.sign(
          { email: inputEmail, id: staffData._id },
          "collegeApp",
          { expiresIn: "2h" },
          (error, token) => {
            if (error) {
              res.json({
                status: "error",
                message: "error in signin token",
                
              });
            } else {
              res.json({
                status: "success",
                message: "Staff login success",
                data: staffData,
                token: token,
              });
            }
          }
        );
      } else {
        res.json({
          status: "error",
          message: "password is not correct",
        });
      }
    }

    let hodData = await Hod.findOne({ email: inputEmail });
    if (hodData) {
      if (hodData.password === inputPassword) {
        jwt.sign(
          { email: inputEmail, id: hodData._id },
          "collegeApp",
          { expiresIn: "2h" },
          (error, token) => {
            if (error) {
              res.json({
                status: "error",
                message: "error signin token",
              });
            } else {
              res.json({
                status: "success",
                message: "Hod login success",
                data: hodData,
                token: token,
              });
            }
          }
        );
      } else {
        return res.json({
          status: "error",
          message: "Password is not correct",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong in signin",
    });
  }
});

module.exports = router;
