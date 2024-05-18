const express = require("express");
const Hod = require("../models/hodModel");
const Admin = require("../models/adminModel");
const Student = require("../models/studentModel");
const Staff = require("../models/staffModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

//fetch admin details
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
        const id = req.params.id;
        let data = await Admin.findById(id);
        if (!data || data.length === 0) {
          return res.status(404).json({
            status: "error",
            message: "No data found",
          });
        }
        res.status(200).json({
          status: "success",
          data: data,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "somthing went wrong in admin details",
    });
  }
});

//update data by id
router.put("/update/:id", async (req, res) => {
  try {
    let token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let id = req.params.id;
        let input = req.body;
        if (!input.email && !input.password) {
          return res.status(400).json({
            status: "error",
            message: "Email and password cannot be null",
          });
        }
        let data = await Admin.findById(id);
        if(!data || data.length===0){
          return res.status(404).json({
            status:"error",
            message:"no data found"
          })
        }
        data.email = input.email;
        data.password = input.password;
        await data.save();
        res.status(200).json({
          status: "success",
          message: "successfully updated data",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "somthing went wrong in update admin details",
    });
  }
});

//signin of Admin, Student, Hod and Staff
router.post("/signin", async (req, res) => {
  try {
    let input = req.body;
    let inputEmail = input.email;
    let inputPassword = input.password;
    if (!inputEmail || !inputPassword) {
      return res.status(400).json({
        status: "error",
        message: "Inputs can not be null",
      });
    }
    let adminData = await Admin.findOne({ email: inputEmail });
    let studentData = await Student.findOne({ email: inputEmail });
    let staffData = await Staff.findOne({ email: inputEmail });
    let hodData = await Hod.findOne({ email: inputEmail });

    if (adminData) {
      if (adminData.password === inputPassword) {
        jwt.sign(
          { email: inputEmail, id: adminData._id },
          "collegeApp",
          { expiresIn: "1d" },
          (error, token) => {
            if (error) {
              res.json({
                status: "error",
                message: "Error signing token",
              });
            } else {
              res.json({
                status: "success",
                message: "Admin login success",
                data: adminData,
                token: token,
                expiryTime: "1d",
              });
            }
          }
        );
      } else {
        return res.json({
          status: "error",
          message: "Incorrect Password",
        });
      }
    } else if (studentData) {
      if (studentData.password === inputPassword) {
        jwt.sign(
          { email: inputEmail, id: studentData._id },
          "collegeApp",
          { expiresIn: "2h" },
          (error, token) => {
            if (error) {
              res.json({
                status: "error",
                message: "error signin token",
              });
            } else {
              res.json({
                status: "success",
                message: "Student login success",
                data: studentData,
                token: token,
                expiryTime: "2h",
              });
            }
          }
        );
      } else {
        return res.json({
          status: "error",
          message: "Incorrect Password",
        });
      }
    } else if (staffData) {
      if (staffData.password === inputPassword) {
        jwt.sign(
          { email: inputEmail, id: staffData._id },
          "collegeApp",
          { expiresIn: "1d" },
          (error, token) => {
            if (error) {
              res.json({
                status: "error",
                message: "error in signin token",
              });
            } else {
              res.json({
                status: "success",
                message: "Staff login success",
                data: staffData,
                token: token,
                expiryTime: "1d",
              });
            }
          }
        );
      } else {
        res.json({
          status: "error",
          message: "Incorrect Password",
        });
      }
    } else if (hodData) {
      if (hodData.password === inputPassword) {
        jwt.sign(
          { email: inputEmail, id: hodData._id },
          "collegeApp",
          { expiresIn: "1d" },
          (error, token) => {
            if (error) {
              res.json({
                status: "error",
                message: "error signin token",
              });
            } else {
              res.json({
                status: "success",
                message: "Hod login success",
                data: hodData,
                token: token,
                expiryTime: "1d",
              });
            }
          }
        );
      } else {
        return res.json({
          status: "error",
          message: "Incorrect Password",
        });
      }
    } else {
      res.json({
        status: "error",
        message: "No user found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
