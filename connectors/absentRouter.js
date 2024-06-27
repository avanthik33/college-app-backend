const express = require("express");
const absentModel = require("../models/absentModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Add absent details
router.post("/addAbsent", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        const input = req.body.absentees;
        if ( !input.staff || !input.period) {
          return res.status(400).json({
            status: "error",
            message: "inputs can not be null",
          });
        }
        const newAbsent = new absentModel(input);
        await newAbsent.save();
        return res.json({
          status: "success",
          message: "Successfully added absent details",
        });
      }
    });
  } catch (error) {
    console.error("Error adding absent details:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

//view absent students by date and course
router.post("/viewAbsentees", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        const inputDate = new Date(req.body.date);
        const courseId = req.body.course_id;
        if (!inputDate || !courseId) {
          return res.status(400).json({
            status: "error",
            message: "inputs can not be null",
          });
        }
        if (isNaN(inputDate)) {
          return res.status(400).json({
            status: "error",
            message: "Invalid date format",
          });
        }
        const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999));
        const data = await absentModel
          .find({
            date: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          })
          .populate({
            path: "absentStudents",
            match: { course_id: courseId },
          })
          .populate("staff")
          .exec();

        // Filter out documents where the absentStudents array is empty
        const filteredData = data.filter(
          (item) => item.absentStudents.length > 0
        );
        return res.status(200).json({
          status: "success",
          data: filteredData,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

//view absent details of one student
router.post("/viewAbsent", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let studentId = req.body.id;
        if (!studentId) {
          return res.status(400).json({
            status: "error",
            message: "inputs can not be null",
          });
        }
        let data = await absentModel.find({ absentStudents: studentId });
        if (!data || data.length === 0) {
          return res.status(404).json({
            status: "error",
            message: "no data found",
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
module.exports = router;
