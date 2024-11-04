const express=require("express");
const app=express();
app.use((req,res)=>{
    res.send("this is server");
}) 


app.listen(3000, ()=>{
    console.log("server success port 3000");
});