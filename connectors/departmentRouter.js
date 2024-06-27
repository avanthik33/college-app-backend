const express = require("express");
const Department = require("../models/departmentModel");
const jwt = require("jsonwebtoken");
const Course = require("../models/courseModel");
const Hod = require("../models/hodModel");
const Staff = require("../models/staffModel");

const router = express.Router();

//add department
router.post("/addDep", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (decoded) {
        let data = req.body;
        let department = data.department;
        let description = data.description;
        if (!description || !department) {
          return res.status(400).json({
            status: "error",
            message: "input not found",
          });
        }
        let match = await Department.findOne({ department: department });
        if (!match) {
          let newDep = new Department(data);
          await newDep.save();
          return res.json({
            status: "success",
            message: "successfully added department",
          });
        } else {
          return res.json({
            status: "error",
            message: "department already exist",
          });
        }
      } else {
        return res.json({
          status: "error",
          message: "unautharised user",
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "somthing went wrong in add department",
    });
  }
});

//view all department
router.get("/viewAll", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (decoded) {
        let data = await Department.find()
          .populate("admin_id", "-_id -__v -password")
          .exec();
        return res.json({
          status: "success",
          depData: data,
        });
      } else {
        return res.json({
          status: "error",
          message: "unautherised user",
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "somthing went wrong in view all department",
    });
  }
});

//delete department by id
router.delete("/delete/:id", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "error",
          message: "unauthorized user",
        });
      } else {
        let id = req.params.id;
        const department = await Department.findById(id);
        if (!department) {
          return res.status(404).json({
            status: "error",
            message: "Department not found",
          });
        }
        await department.deleteOne();
        return res.json({
          status: "success",
          message: "Department deleted",
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong in delete department",
    });
  }
});

//edit department by id
router.put("/edit/:id", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        const id = req.params.id;
        let input = req.body;
        if (!input.department || !input.description) {
          return res.status(400).json({
            status: "error",
            message: "No input data Found",
          });
        }
        let inputDepartment = req.body.department;
        let inputDescription = req.body.description;
        let data = await Department.findById(id);
        data.department = inputDepartment;
        data.description = inputDescription;
        await data.save();
        return res.json({
          status: "success",
          message: "successfully updated",
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "somthing went wrong in edit department",
    });
  }
});

//view department by id
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
        let id = req.params.id;
        let data = await Department.findById(id);
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
      message: "somthing went wrong in veiw department by id",
    });
  }
});

module.exports = router;
