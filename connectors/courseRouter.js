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
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let data = req.body;
        let course = data.course;
        if (!data || !course) {
          return res.status(400).json({
            status: "error",
            message: "no input data found",
          });
        }
        let match = await Course.findOne({ course: course });
        if (!match) {
          let newCourse = new Course(data);
          await newCourse.save();
          return res.json({
            status: "success",
            message: "successfully course added.",
          });
        } else {
          return res.json({
            status: "error",
            message: "course already exist",
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
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
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let data = await Course.find()
          .populate("department_id", "-_id -__v ")
          .exec();
        return res.json({
          status: "success",
          Courses: data,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "somthing error in view all courses",
    });
  }
});

//view all course in the department
router.post("/viewCourseByDep", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let depId = req.body.department_id;
        let data = await Course.find({ department_id: depId })
          .populate("department_id")
          .exec();
        return res.json({
          status: "error",
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

module.exports = router;
