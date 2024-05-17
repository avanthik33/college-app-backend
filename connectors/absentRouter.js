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

//view absent students by date
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
          .populate("staff absentStudents");
        return res.status(200).json({
          status: "success",
          data: data,
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
        let data = await absentModel.find({ absentStudents: studentId });
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
