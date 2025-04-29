import validator from 'validator';


export const validateSignupData = (req)=>{

    const {firstName,lastName,emailId,password}=req.body;

    if(!firstName || !lastName){
        throw new Error("Name is Not Valid!");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Emial is not Valid!");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please make password Strong!");
    }

}

export const validatedEditProfileData=(req)=>{
    const allowedEditFields=[
        "firstName",
        "lastName",
        "emailId",
        "age",
        "gender",
        "photoUrl",
        "about",
        "skills"
    ];

    const isAllowedEdit = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );

    return isAllowedEdit;


}

