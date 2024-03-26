const express = require("express");
const SubjectAllocation = require("../models/subjectAllocationModel");

const router = express.Router();

// add subject allocation by hod
router.post("/allocate", async (req, res) => {
  try {
    let data = req.body;
    let newSubAllocation = new SubjectAllocation(data);
    await newSubAllocation.save();
    res.json({
      status: "success",
      message: "successfully allocated subject",
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
