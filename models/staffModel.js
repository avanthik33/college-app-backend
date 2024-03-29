const mongoose = require("mongoose");

const Staff = new mongoose.Schema({
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
  gender: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departments",
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

Staff.pre("deleteOne", async function (next) {
  try {
    const staffId = this.getQuery()._id;
    const Student = mongoose.model("Students");
    const SubjectAllocation = mongoose.model("SubjectAllocations");
    await Student.deleteMany({ staff_id: staffId });
    await SubjectAllocation.deleteMany({ staff_id: staffId });
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model("Staffs", Staff);
