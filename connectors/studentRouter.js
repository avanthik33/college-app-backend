const express=require("express")
const Student=require("../models/studentModel")

const router=express.Router()

//adding student by admin
router.post("/addStudent",async(req,res)=>{
  try {
    let data=req.body
    let newStudent=new Student(data)
    await newStudent.save()
    res.json({
      status:"success",
      message:"successfully added student"
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      status:"error",
      message:"somthing went wrong in add student by admin"
    })
  }
})

//student need to update password


module.exports=router