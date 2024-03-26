const express = require("express");
const Student = require("../models/studentModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

//adding student by admin
router.post("/addStudent", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let data = req.body;
        let existStudent = data.email;
        let match = await Student.findOne({ email: existStudent });
        if (!match) {
          let newStudent = new Student(data);
          await newStudent.save();
          res.json({
            status: "success",
            message: "successfully added student",
          });
        } else {
          res.json({
            status: "error",
            message: "student already exist",
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "somthing went wrong in add student by admin",
    });
  }
});

//student need to update password

module.exports = router;
