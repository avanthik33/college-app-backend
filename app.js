const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const adminRouter=require("./connectors/adminRouter")
const departmentRouter=require("./connectors/departmentRouter")
const courseRouter=require("./connectors/courseRouter")
const studentRouter=require("./connectors/studentRouter")
const hodRouter=require("./connectors/hodRouter")
const staffRouter=require("./connectors/staffRouter")
const subjectRouter=require("./connectors/subjectRouter")
const subjectAllocationRouter=require("./connectors/subjectAllocationRouter")

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://avanthik:avanthik@cluster0.yuxak7x.mongodb.net/CollegeDb?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true }
);

app.use("/admin",adminRouter)
app.use("/dep",departmentRouter)
app.use("/course",courseRouter)
app.use("/student",studentRouter)
app.use("/hod",hodRouter)
app.use("/staff",staffRouter)
app.use("/subject",subjectRouter)
app.use("/subAllocation",subjectAllocationRouter)


app.listen(3001,()=>{
  console.log("server is running..")
})
