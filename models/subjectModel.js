const mongoose = require("mongoose");

const Subject = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Subjects", Subject);
