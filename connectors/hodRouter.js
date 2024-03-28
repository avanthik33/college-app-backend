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
        let id = data.idNumber;
        let match2 = await Hod.findOne({ idNumber: id });
        if (match2) {
          res.json({
            status: "error",
            message: "ID already exist",
          });
        }
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

//search hod
router.post("/search", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "error",
          message: "Unauthorized user",
        });
      } else {
        const { firstName, idNumber } = req.body;
        let data = await Hod.findOne({ firstName })
          .populate("department_id")
          .exec();
        if (!data) {
          data = await Hod.findOne({ idNumber: idNumber })
            .populate("department_id")
            .exec();
        }
        if (data) {
          return res.json({
            status: "success",
            data: data,
          });
        } else {
          return res.json({
            status: "error",
            message: "No data found",
          });
        }
      }
    });
  } catch (error) {
    console.error("Error in search hod:", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong in search hod",
    });
  }
});

//view all hods
router.get("/viewAll", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let data = await Hod.find().populate("department_id").exec();
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
      message: "somthing went wrong in view all hod",
    });
  }
});

module.exports = router;
