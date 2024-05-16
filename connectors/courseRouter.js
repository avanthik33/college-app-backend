const express = require("express");
const Course = require("../models/courseModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

//add course
router.post("/add", async (req, res) => {
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
        let course = data.course;
        let match = await Course.findOne({ course: course });
        if (!match) {
          let newCourse = new Course(data);
          await newCourse.save();
          res.json({
            status: "success",
            message: "successfully course added.",
          });
        } else {
          res.json({
            status: "error",
            message: "course already exist",
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "somthing went wrong in add course",
    });
  }
});

//view all courses
router.get("/viewall", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let data = await Course.find()
          .populate("department_id", "-_id -__v ")
          .exec();
        res.json({
          status: "success",
          Courses: data,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "somthing error in view all courses",
    });
  }
});

//view all course in the department
router.post("/viewCourseByDep", async (req, res) => {
  try {
    let depId = req.body.department_id;
    let data = await Course.find({ department_id: depId });
    return res.json({
      status: "error",
      data: data,
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

module.exports = router;
