const express = require("express");
const Staff = require("../models/staffModel");
const jwt = require("jsonwebtoken");
const router = express.Router();

//add staff by hod
router.post("/addStaff", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let input = req.body;
        let inputEmail = input.email;
        let data = await Staff.findOne({ email: inputEmail });
        if (!data) {
          let newStaff = new Staff(input);
          await newStaff.save();
          res.json({
            status: "success",
            message: "successfully added staff",
          });
        } else {
          res.json({
            status: "error",
            message: "staff is already exist",
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "somthing went wrong in staff add by hod",
    });
  }
});

//view all staff
router.get("/viewall", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        res.json({
          status: "error",
          message: "unauthaized user",
        });
      } else {
        let data = await Staff.find()
          .populate("department_id", "-description -_id -__v")
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
      message: "somthing went wrong in staff add by hod",
    });
  }
});
module.exports = router;
