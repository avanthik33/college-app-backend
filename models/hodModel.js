const mongoose = require("mongoose");

const Hod = new mongoose.Schema({
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
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departments",
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Hods", Hod);
