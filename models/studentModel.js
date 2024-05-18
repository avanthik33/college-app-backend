const mongoose = require("mongoose");

const Student = new mongoose.Schema({
  staff_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staffs",
    required: true,
  },
  idNumber: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
Student.pre("deleteOne", async function (next) {
  try {
    const studentId = this.getQuery()._id;
    const AbsentModel = mongoose.model("absentees");
    await AbsentModel.deleteMany({ absentStudents: studentId });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Students", Student);
