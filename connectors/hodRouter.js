const express=require("express")
const Hod=require("../models/hodModel")


const router=express.Router()

//Add hod
router.post("/addHod", async (req, res) => {
  try {
    let data = req.body;
    let newHod = new Hod(data);
    await newHod.save();
    res.json({
      status: "success",
      message: "successfully added",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "somthing went wrong in adding hod.",
    });
  }
});



module.exports=router