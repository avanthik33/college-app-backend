const mongoose = require("mongoose");

const Department = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Departments", Department);
