const express = require("express");
const Student = require("../models/studentModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

//adding student by staff
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
        let id = data.idNumber;
        let match2 = await Student.findOne({ idNumber: id });
        if (match2) {
          res.json({
            status: "error",
            message: "Id already exist",
          });
        }
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

router.post("/viewByDep", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized user",
        });
      } else {
        const input = req.body.departmentId;
        const students = await Student.find()
          .populate({
            path: "course_id",
            match: { department_id: input }, 
          })
          .exec();

        const filteredStudents = students.filter(
          (student) => student.course_id !== null
        ); 

        if (filteredStudents.length === 0) {
          return res.status(404).json({
            status: "error",
            message: "No students found for the given department",
          });
        }

        return res.status(200).json({
          status: "success",
          data: filteredStudents,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong in view student by department",
    });
  }
});

module.exports = router;
