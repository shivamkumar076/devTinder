const validator=require("validator");

const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName){
        throw new Error("name is not valid please enter name :");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter strong password");
    }


    // else if(firstName.length<4 || firstName.length>50){
    //     throw new Error("firstname should be 4-55")
    // }


}

const validEditProfileData=(req)=>{
    const allowEditField=[
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills",
    ];
    const isEditAllowed=Object.keys(req.body)
    .every((field)=>
        allowEditField.includes(field));
    return isEditAllowed;
}
module.exports={validateSignUpData,validEditProfileData};