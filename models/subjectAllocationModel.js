const mongoose = require("mongoose");

const SubjectAllocation = new mongoose.Schema({
  staff_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staffs",
    required: true,
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subjects",
    required: true,
  },
});


module.exports = mongoose.model("SubjectAllocations", SubjectAllocation);
