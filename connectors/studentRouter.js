const express = require("express");
const jwt = require("jsonwebtoken");
const Student = require("../models/studentModel");
const { transporter } = require("../utils");

const router = express.Router();

//adding student by staff
router.post("/addStudent", async (req, res) => {
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
        let id = data.idNumber;
        let match2 = await Student.findOne({ idNumber: id });
        if (match2) {
          return res.json({
            status: "error",
            message: "Id already exist",
          });
        }
        let existStudent = data.email;
        let match = await Student.findOne({ email: existStudent });
        if (!match) {
          let newStudent = new Student(data);
          await newStudent.save();

          const mailOptions = {
            to: data.email,
            subject: "Welcome to Our College",
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
        <h2 style="color: #333; margin-bottom: 20px;">Dear ${data.firstName} ${data.lastName},</h2>
        <p style="color: #333; font-size: 16px;">
          We are thrilled to welcome you as a new student at ABCD College. Your journey with us will be filled with exciting opportunities and valuable experiences.
        </p>
        <p style="color: #333; font-size: 16px;">
          Here are your login credentials:
        </p>
        <ul style="color: #333; font-size: 16px; padding-left: 20px;">
          <li><strong>College ID Number:</strong> ${data.idNumber}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Password:</strong> ${data.password}</li>
        </ul>
        <p style="color: #333; font-size: 16px;">
          Please keep your login credentials secure and do not share them with anyone.
        </p>
        <p style="color: #333; font-size: 16px;">
          If you have any questions or need assistance, feel free to contact us at admin@abcdcollege.com.
        </p>
        <p style="color: #333; font-size: 16px;">
          Welcome to our community!
        </p>
        <p style="color: #333; font-size: 16px;">
          Best regards,<br>
          College Administration
        </p>
      </div>
    </div>
  `,
          };

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.error("Error sending email:", err);
            } else {
              console.log("Email sent:", info.response);
            }
          });
          return res.json({
            status: "success",
            message: "successfully added student and mail send",
          });
        } else {
          return res.json({
            status: "error",
            message: "student already exist",
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "somthing went wrong in add student by admin",
    });
  }
});

//view all student by department
router.post("/viewByDep", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized user",
        });
      } else {
        const input = req.body.departmentId;
        const students = await Student.find()
          .populate({
            path: "course_id",
            match: { department_id: input },
          })
          .exec();

        const filteredStudents = students.filter(
          (student) => student.course_id !== null
        );

        if (filteredStudents.length === 0) {
          return res.status(404).json({
            status: "error",
            message: "No students found for the given department",
          });
        }

        return res.status(200).json({
          status: "success",
          data: filteredStudents,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong in view student by department",
    });
  }
});

//view students by course
router.post("/viewStudByCourse", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "errro",
          message: "unautherized user",
        });
      } else {
        const course_id = req.body.course_id;
        if (!course_id) {
          return res.status(400).json({
            status: "error",
            message: "no input found",
          });
        }
        const students = await Student.find({ course_id: course_id });
        return res.status(200).json({
          status: "success",
          data: students,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: "error",
      message: "internal server error",
      error: error.message,
    });
  }
});

//search Student by firstName
router.post("/searchStudentByName", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let name = req.body.name;
        let data = await Student.findOne({ firstName: name })
          .populate("course_id")
          .exec();
        if (!data) {
          return res.status(400).json({
            status: "error",
            messsage: "no data found",
          });
        }
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
      message: "internal server error",
      error: error.message,
    });
  }
});

//total student finder
router.get("/totalStudents", async (req, res) => {
  try {
    const token = req.headers["token"];
    jwt.verify(token, "collegeApp", async (error, decoded) => {
      if (error) {
        return res.json({
          status: "error",
          message: "unautherized user",
        });
      } else {
        let data = await Student.find();
        let totalStudents = data.length;
        return res.json({
          status: "success",
          data: totalStudents,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "internal server error",
    });
  }
});

//view student by id
router.post("/viewStudent/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let data = await Student.findById(id).populate("course_id").exec();
    if (!data) {
      return res.json({
        status: "error",
        message: "no data found",
      });
    }
    return res.json({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: "error",
      message: "internal server error",
    });
  }
});

//update student profile
router.put("/profile/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let input = req.body;
    let data = await Student.findByIdAndUpdate(
      { _id: id },
      { $set: input },
      { new: true }
    );
    if (!data) {
      return res.json({
        status: "error",
        message: "no data found",
      });
    }
    return res.json({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: "error",
      message: "internal server error",
    });
  }
});
module.exports = router;
