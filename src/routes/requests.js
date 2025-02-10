const express=require('express');
const requestRouter=express.Router();
const connectionRequestmodel=require("../models/connectionRequest")
const {userAuth}=require('../middlewares/auth');
const User=require('../models/user');
const {checkBlacklist}=require('../middlewares/checkBlackList');
requestRouter.post("/request/send/:status/:toUserId",checkBlacklist,
    userAuth,
    async(req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;
        const allowedstatus=["ignored","interested"];
        if(!allowedstatus.includes(status)){
            return res.status(400).json({
                message:"invalid status type :"+status
            })
        };
        const touser=await User.findById(toUserId);
        if(!touser){
            return res.status(400).json({
                message:"user not found"
            })
        }
        const existingConnectionRequest=await connectionRequestmodel.findOne({
            $or:[{fromUserId, toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ],
        });
        if(existingConnectionRequest){
            return res.status(400).json({
                message:"connection request already exists"
            });
        }
        const connectionRequest=new connectionRequestmodel({
            fromUserId,
            toUserId,
            status
        });
        const data=await connectionRequest.save();
        res.json({
            message:"connection request sent successfully", 
            data,
        })
    }catch(err){
        res.status(400).send("ERROR "+err);
    }
   
})
requestRouter.post("/request/review/:status/:requestId",checkBlacklist,
    userAuth,
    async (req,res)=>{
    try{
        const loggedInUser=req.user;
        const {requestId,status}=req.params

        const allowedStatus=["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            res.status(400).json({
                message:"status not allowed"
            })
        };
        const connectionRequest=await connectionRequestmodel.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested",
        });
        if(!connectionRequest){
            return res.status(404).json({
                message:"connection request not found"
            });
        }
        connectionRequest.status=status;
        const data=await connectionRequest.save();
        res.json({
            message:"connection request "+ status,data
        })
    }catch(err){
        res.status(400).send("Error"+err.message);
    }

})
module.exports=requestRouter;