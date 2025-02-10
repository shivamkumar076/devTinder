const express=require("express")
const profileRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const {validEditProfileData}=require("../utils/validation");
// const bcrypt=require('bcrypt');
const {checkBlacklist}=require("../middlewares/checkBlackList");
profileRouter.get("/profile/view",checkBlacklist,userAuth,async (req,res)=>{
    try{
      const user=req.user;
      res.status(200).json(user);
    }catch(err){
        res.status(400).send("error"+err.message)
    } 
});
profileRouter.patch("/profile/edit",checkBlacklist,userAuth,async(req,res)=>{
  try{
    if(!validEditProfileData(req)){
        throw new Error("invalid edit request");
    }
    const loggedInUser=req.user;
    Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
    await loggedInUser.save();
    res.send(`${loggedInUser.firstName},your profile Update Successfully`);
  }catch(err){
    res.status(401).send("error"+err.message)
  }
});


module.exports=profileRouter;    