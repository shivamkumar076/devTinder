const express=require("express");
const app=express();
app.get("/user/:id",(req,res)=>{
    console.log(req.params);
    res.send({
        firstname:"shivam",
        lastname:"kumar"
        
    });
}) 



app.listen(3000, ()=>{
    console.log("server success port 3000");
});