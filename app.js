const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const adminRouter = require("./connectors/adminRouter");
const departmentRouter = require("./connectors/departmentRouter");
const courseRouter = require("./connectors/courseRouter");
const studentRouter = require("./connectors/studentRouter");
const hodRouter = require("./connectors/hodRouter");
const staffRouter = require("./connectors/staffRouter");
const subjectRouter = require("./connectors/subjectRouter");
const subjectAllocationRouter = require("./connectors/subjectAllocationRouter");
const absentRouter = require("./connectors/absentRouter");
const semesterRouter = require("./connectors/semesterRouter");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use("/admin", adminRouter);
app.use("/dep", departmentRouter);
app.use("/course", courseRouter);
app.use("/student", studentRouter);
app.use("/hod", hodRouter);
app.use("/staff", staffRouter);
app.use("/subject", subjectRouter);
app.use("/subAllocation", subjectAllocationRouter);
app.use("/absent", absentRouter);
app.use("/semester", semesterRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});