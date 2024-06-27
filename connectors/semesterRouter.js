const express = require("express");
const SemesterModel = require("../models/semesterModel");
const jwt = require("jsonwebtoken");
const semesterModel = require("../models/semesterModel");

const router = express.Router();

//add semester
router.post("/addSemester", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.status(405).json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let { semester, students, subjects, course_id } = req.body;
        if (!semester || !students || !subjects || !course_id) {
          return res.status(400).json({
            status: "error",
            message: "input not found",
          });
        }
        let newSemester = new SemesterModel({
          semester,
          students,
          subjects,
          course_id,
        });
        let data = await newSemester.save();
        return res.json({
          status: "success",
          message: "successfully added new semester",
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

//view semster for course
router.post("/viewSemByCourse", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let courseId = req.body.course_id;
        let data = await semesterModel
          .find({ course_id: courseId })
          .populate("course_id students subjects")
          .exec();
        if (!data || data.length === 0) {
          return res.json({
            status: "error",
            message: "No data found for the given course.",
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
      message: "Internal server error",
    });
  }
});

module.exports = router;
