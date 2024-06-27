const mongoose = require("mongoose");

const absentModel = new mongoose.Schema({
  absentStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
    },
  ],
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staffs",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  period: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("absentees", absentModel);
