const mongoose=require('mongoose');
const connectionRequest=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",  //reference to the user collection
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{values} is incorrect status type`
        }
    },
},
{
    timestamps:true,
}
);
connectionRequest.index({
    fromUserId:1,
    toUserId:1
})
connectionRequest.pre("save",function(next){
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send request to yourself");
    }
    next();

})
const connectionRequestmodel=new mongoose.model(
    "ConnectionRequestModel",
    connectionRequest
);
module.exports=connectionRequestmodel;