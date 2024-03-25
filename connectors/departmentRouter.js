const express = require("express");
const Department = require("../models/departmentModel");
const { find } = require("../models/hodModel");

const router = express.Router();

//add department
router.post("/addDep", async (req, res) => {
  try {
    let data = req.body;
    let newDep = new Department(data);
    await newDep.save();
    res.json({
      status: "success",
      message: "successfully added department",
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
    let data = await Department.find();
    res.json({
      status: "success",
      depData: data,
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
