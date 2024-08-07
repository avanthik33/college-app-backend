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
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let data = req.body;
        if(!data.staff_id || !data.subject_id){
          return res.status(400).json({
            status:"error",
            message:"input is not found"
          })
        }
        let newSubAllocation = new SubjectAllocation(data);
        await newSubAllocation.save();
        return res.json({
          status: "success",
          message: "successfully allocated subject",
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "somthing went wrong in subejct allocation",
    });
  }
});

//view all subject allocation
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
        let data = await SubjectAllocation.find().populate("staff_id subject_id","-_id -__v");
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
      message: "somthing went wrong in view all subject allocation",
    });
  }
});
module.exports = router;
