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



module.exports = mongoose.model("Courses", Course);
