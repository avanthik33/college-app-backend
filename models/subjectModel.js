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

Subject.pre("deleteOne", async function (next) {
  try {
    const subjectId = this.getQuery()._id;
    const SubjectAllocation = mongoose.model("SubjectAllocations");
    await SubjectAllocation.deleteMany({ subject_id: subjectId });
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model("Subjects", Subject);
