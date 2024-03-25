const express = require("express");
const Course = require("../models/courseModel");

const router = express.Router();

//add course
router.post("/add", async (req, res) => {
  try {
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
    let data = await Course.find()
      .populate("department_id", "-_id -__v -description")
      .exec();
    res.json({
      status: "success",
      Courses: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "somthing error in view all courses",
    });
  }
});

module.exports = router;
