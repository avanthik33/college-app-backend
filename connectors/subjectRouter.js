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
        res.json({
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
          res.json({
            status: "success",
            message: "successfully added new subject",
          });
        } else {
          res.json({
            status: "error",
            message: "subject is already exist",
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
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
        res.json({
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
        res.json({
          status: "success",
          data: data,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "somthing went wrong in add subject",
    });
  }
});
module.exports = router;
