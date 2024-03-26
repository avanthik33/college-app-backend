const express = require("express");
const Subject = require("../models/subjectModel");

const router = express.Router();

//add subject by hod
router.post("/addSub", async (req, res) => {
  try {
    let data = req.body;
    let existingSub = data.Subject;
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "somthing went wrong in add subject",
    });
  }
});

module.exports = router;
