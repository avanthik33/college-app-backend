const express = require("express");
const Hod = require("../models/hodModel");
const Admin = require("../models/adminModel");
const Student = require("../models/studentModel");

const router = express.Router();


//signin of Admin, Student, and Hod
router.post("/signin", async (req, res) => {
  try {
    let input = req.body;
    let inputEmail = input.email;
    let inputPassword = input.password;
    let adminData = await Admin.findOne({ email: inputEmail });
    if (adminData) {
      if (adminData.password === inputPassword) {
        return res.json({
          status: "success",
          message: "Admin login success",
        });
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
        return res.json({
          status: "success",
          message: "Student login success",
        });
      } else {
        return res.json({
          status: "error",
          message: "Password is not correct",
        });
      }
    }

    let hodData = await Hod.findOne({ email: inputEmail });
    if (hodData) {
      if (hodData.password === inputPassword) {
        return res.json({
          status: "success",
          message: "HOD login success",
        });
      } else {
        return res.json({
          status: "error",
          message: "Password is not correct",
        });
      }
    }
    return res.json({
      status: "error",
      message: "No user found",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong in user signin",
    });
  }
});

module.exports = router;
