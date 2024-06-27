const mongoose = require("mongoose");

const semesterModel = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
      required: true,
    },
  ],
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subjects",
      required: true,
    },
  ],
});

module.exports = mongoose.model("semesters", semesterModel);
