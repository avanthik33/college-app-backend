const express = require("express");
const Hod = require("../models/hodModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

//Add hod
router.post("/addHod", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        res.json({
          status: "error",
          message: "unautharised user",
        });
      } else {
        let data = req.body;
        let existHod = data.email;
        let match = await Hod.findOne({ email: existHod });
        if (!match) {
          let newHod = new Hod(data);
          await newHod.save();
          res.json({
            status: "success",
            message: "successfully added",
          });
        } else {
          res.json({
            status: "error",
            message: "hod already exisit",
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "somthing went wrong in adding hod.",
    });
  }
});

//view hod's department by hod id
router.get("/view/:id", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let hodId = req.params.id;
        let data = await Hod.findOne({ _id: hodId })
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
      message: "somthing went wrong in view department by hod id",
    });
  }
});

module.exports = router;
