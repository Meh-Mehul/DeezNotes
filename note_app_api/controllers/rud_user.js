const bcrypt = require('bcrypt');
const User = require('../models/user');

const getUserfromID = async (req, res, next)=>{
    const id = req.params.id;
    const user = await User.findById(id);
    res.json({message:"Here is the User", data:user});
};

const getuserinfo = (req,res,next)=>{
    res.json({ message: `Welcome ${req.user.name}`, data:req.user });
}
  
const update = async function (req,res,next){
    const {email,oldpassword, password } = req.body;
    const curruser = req.user.name
    const temp = await User.findOne({name:curruser})
    const passwordMatch = await temp.comparePassword(oldpassword);
    if(passwordMatch){
        const newhashpwd = await bcrypt.hash(password, 10);
        try{
            const user = await User.findOneAndUpdate( { name:curruser } ,{email:email, password:newhashpwd});
            res.json({message:"You were updated wrt us", data:req.user});
        }
        catch(error){
            res.json({message:error, data:null});
        }

    }
    else{
        res.json({message:"Wrong Old Password", data:null});
    }
 
};

// Although Not needed
const deleteUser = async (req,res,next)=>{
    const username = req.user.name;
    const user = await User.findOneAndDelete({name:username});
    res.json({message:"You are no more"});
}


module.exports = { getUserfromID,update ,getuserinfo, deleteUser};