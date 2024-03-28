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


Course.pre("remove", async function(next) {
    await this.model("Courses").deleteMany({ admin_id: this.admin_id });
    await this.model("Courses").deleteMany({ department_id: this.department_id });
    next();
});


module.exports = mongoose.model("Courses", Course);
