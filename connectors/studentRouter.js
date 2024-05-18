const express = require("express");
const jwt = require("jsonwebtoken");
const Student = require("../models/studentModel");

const router = express.Router();

//adding student by staff
router.post("/addStudent", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let data = req.body;
        let id = data.idNumber;
        let match2 = await Student.findOne({ idNumber: id });
        if (match2) {
          return res.json({
            status: "error",
            message: "Id already exist",
          });
        }
        let existStudent = data.email;
        let match = await Student.findOne({ email: existStudent });
        if (!match) {
          let newStudent = new Student(data);
          await newStudent.save();
          return res.json({
            status: "success",
            message: "successfully added student",
          });
        } else {
          return res.json({
            status: "error",
            message: "student already exist",
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "somthing went wrong in add student by admin",
    });
  }
});

//view all student by department
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

//view students by course
router.post("/viewStudByCourse", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "errro",
          message: "unautherized user",
        });
      } else {
        const course_id = req.body.course_id;
        if (!course_id) {
          return res.status(400).json({
            status: "error",
            message: "no input found",
          });
        }
        const students = await Student.find({ course_id: course_id });
        return res.status(200).json({
          status: "success",
          data: students,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: "error",
      message: "internal server error",
      error: error.message,
    });
  }
});

//search Student by firstName
router.post("/searchStudentByName", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let name = req.body.name;
        let data = await Student.findOne({ firstName: name })
          .populate("course_id")
          .exec();
        if (!data) {
          return res.status(400).json({
            status: "error",
            messsage: "no data found",
          });
        }
        return res.json({
          status: "success",
          data: data,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: "error",
      message: "internal server error",
      error: error.message,
    });
  }
});

//total student finder
router.get("/totalStudents", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let data = await Student.find();
        let totalStudents = data.length;
        return res.json({
          status: "success",
          data: totalStudents,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "internal server error",
    });
  }
});
module.exports = router;
