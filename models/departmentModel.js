const mongoose = require("mongoose");

const Department = new mongoose.Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admins",
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

Department.pre("deleteOne", async function (next) {
  try {
    const departmentId = this.getQuery()._id;
    const Course = mongoose.model("Courses");
    const Hod = mongoose.model("Hods");
    const Staff = mongoose.model("Staffs");
    await Course.deleteMany({ department_id: departmentId });
    await Hod.deleteMany({ department_id: departmentId });
    await Staff.deleteMany({ department_id: departmentId });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Departments", Department);
