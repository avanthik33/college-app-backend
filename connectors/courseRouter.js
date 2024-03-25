const express = require("express");
const Course = require("../models/courseModel");

const router = express.Router();

//add course
router.post("/add", async (req, res) => {
  try {
    let data = req.body;
    let newCourse = new Course(data);
    await newCourse.save();
    res.json({
      status: "success",
      message: "successfully course added.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "somthing went wrong in add course",
    });
  }
});

module.exports = router;
