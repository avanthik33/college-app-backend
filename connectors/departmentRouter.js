const express = require("express");
const Department = require("../models/departmentModel");
const { find } = require("../models/hodModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

//add department
router.post("/addDep", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (decoded) {
        let data = req.body;
        let department = data.department;
        let match = await Department.findOne({ department: department });
        if (!match) {
          let newDep = new Department(data);
          await newDep.save();
          res.json({
            status: "success",
            message: "successfully added department",
          });
        } else {
          res.json({
            status: "error",
            message: "department already exist",
          });
        }
      } else {
        res.json({
          status: "error",
          message: "unautharised user",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "somthing went wrong in add department",
    });
  }
});

//view all department
router.get("/viewAll", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (decoded) {
        let data = await Department.find();
        res.json({
          status: "success",
          depData: data,
        });
      } else {
        res.json({
          status: "error",
          message: "unautherised user",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "somthing went wrong in view all department",
    });
  }
});

module.exports = router;
