const mongoose = require("mongoose");

const Course = new mongoose.Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admins",
    required: true,
  },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departments",
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
});

Course.pre("deleteOne", async function (next) {
  try {
    const courseId = this.getQuery()._id;
    const Student = mongoose.model("Students");
    const Subject = mongoose.model("Subjects");
    await Student.deleteMany({ course_id: courseId });
    await Subject.deleteMany({ course_id: courseId });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Courses", Course);
