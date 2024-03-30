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
        let id = input.idNumber;
        let match2 = await Staff.findOne({ idNumber: id });
        if (match2) {
          res.json({
            status: "error",
            message: "Id already exist",
          });
        }
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

//search Staff
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
        let data = await Staff.findOne({ firstName })
          .populate("department_id")
          .exec();
        if (!data) {
          data = await Staff.findOne({ idNumber: idNumber })
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
    console.error("Error in search Staff:", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong in search Staff",
    });
  }
});

//view staff by id
router.get("/profile/:id", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let id = req.params.id;
        let data = await Staff.findById(id)
          .populate("department_id", "-__v")
          .exec();
        res.json({
          status: "success",
          data: data,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.json({
      status: "error",
      message: "somthing went wrong in view staff",
    });
  }
});

//update staff by id
router.put("/update/:id", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "error",
          message: "unauthorized user",
        });
      } else {
        const id = req.params.id;
        const input = req.body;

        const updatedData = await Staff.findOneAndUpdate(
          { _id: id },
          { $set: input },
          { new: true } 
        );
        if (!updatedData) {
          return res.json({
            status: "error",
            message: "no data found",
          });
        }
        return res.json({
          status: "success",
          message:"successfully updated",
          data: updatedData,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: "error",
      message: "something went wrong in update staff",
    });
  }
});
module.exports = router;
