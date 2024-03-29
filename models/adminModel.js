const mongoose = require("mongoose");

const Admin = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

Admin.pre("deleteOne", async function (next) {
  try {
    let departmentId = this.getQuery()._id;
    const Course = mongoose.model("Courses");
    const Department = mongoose.model("Departments");
    const Hod = mongoose.model("Hods");
    await Course.deleteMany({ department_id: departmentId });
    await Department.deleteMany({ department_id: departmentId });
    await Hod.deleteMany({ department_id: departmentId });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Admins", Admin);
