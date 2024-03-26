const express = require("express");
const SubjectAllocation = require("../models/subjectAllocationModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

// add subject allocation by hod
router.post("/allocate", async (req, res) => {
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
        let newSubAllocation = new SubjectAllocation(data);
        await newSubAllocation.save();
        res.json({
          status: "success",
          message: "successfully allocated subject",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "somthing went wrong in subejct allocation",
    });
  }
});

module.exports = router;
