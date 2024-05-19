const express = require("express");
const Subject = require("../models/subjectModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

//add subject by hod
router.post("/addSub", async (req, res) => {
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
        let existingSub = data.Subject;
        if (!Subject || !data.course_id) {
          return res.status(400).json({
            status: "error",
            message: "input not found",
          });
        }
        let match = await Subject.findOne({ subject: existingSub });
        if (!match) {
          let newSubject = new Subject(data);
          await newSubject.save();
          return res.json({
            status: "success",
            message: "successfully added new subject",
          });
        } else {
          return res.json({
            status: "error",
            message: "subject is already exist",
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "somthing went wrong in add subject",
    });
  }
});

//view all subject
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
        const data = await Subject.find()
          .populate({
            path: "course_id",
            select: "-_id -__v",
            populate: {
              path: "department_id",
              select: "-_id -__v",
            },
          })
          .exec();
        return res.json({
          status: "success",
          data: data,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "somthing went wrong in add subject",
    });
  }
});

router.post("/viewSubByCourse", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        const id = req.body.course_id;
        if (!id) {
          return res.status(400).json({
            status: "error",
            message: "Course ID is required",
          });
        }
        const data = await Subject.find({ course_id: id });

        if (data.length === 0) {
          return res.status(404).json({
            status: "error",
            message: "No subjects found for this course",
          });
        }
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

module.exports = router;
