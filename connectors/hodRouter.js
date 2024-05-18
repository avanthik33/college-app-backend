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
        return res.status(401).json({
          status: "error",
          message: "unautharised user",
        });
      } else {
        let data = req.body;
        let id = data.idNumber;
        if (
          !data.idNumber ||
          !data.firstName ||
          !data.lastName ||
          !data.gender ||
          !data.qualification ||
          data.email ||
          data.phoneNo ||
          data.password
        ) {
          return res.status(400).json({
            status: "error",
            message: "input not found",
          });
        }
        let match2 = await Hod.findOne({ idNumber: id });
        if (match2) {
          return res.json({
            status: "error",
            message: "ID already exist",
          });
        }
        let existHod = data.email;
        let match = await Hod.findOne({ email: existHod });
        if (!match) {
          let newHod = new Hod(data);
          await newHod.save();
          return res.json({
            status: "success",
            message: "successfully added",
          });
        } else {
          return res.json({
            status: "error",
            message: "hod already exisit",
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
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
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let hodId = req.params.id;
        let data = await Hod.findOne({ _id: hodId })
          .populate("department_id", "-description -_id -__v")
          .exec();
        return res.json({
          status: "success",
          data: data,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
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
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let data = await Hod.find().populate("department_id").exec();
        return res.json({
          status: "success",
          data: data,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "somthing went wrong in view all hod",
    });
  }
});

//update hod
router.put("/profile/:id", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let id = req.params.id;
        let input = req.body;

        const updatedData = await Hod.findOneAndUpdate(
          { _id: id },
          { $set: input },
          { new: true }
        );

        if (!updatedData) {
          return res.status(404).json({
            status: "error",
            message: "No data found",
          });
        }
        return res.json({
          status: "success",
          message: "successfully updated",
          data: updatedData,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "somthing went wrong in update hod",
    });
  }
});

//total hods
router.get("/totalHods", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let data = await Hod.find();
        let totalHods = data.length;
        return res.json({
          status: "success",
          data: totalHods,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "somthing went wrong in update hod",
    });
  }
});

module.exports = router;
