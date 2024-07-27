const Note = require('../models/note');
const User = require('../models/user');

const addAccess = async (req, res, next)=>{
    const id = req.params.id;
    const user = req.params.name;
    const userguy = await User.findOne({name:user});
    const note = await Note.findById(id);
    if(!note){
        res.json({message:"Not Found any note with this ID"});
    }
    if(!userguy){
        res.json({message:"Not Found the User"});
    }
    else{
        if(note.author != req.user.name){
            res.status(401).json({message:"You are not authorized to share this note!"});
        }
        else{
            if(note.has_ac.includes(userguy.id)){
                res.json({message:`Successfully Shared the note with ${userguy.name}`, data:"ALREADY"});
            }
            else{
                const new_ac_ar  = note.has_ac;
                new_ac_ar.push(userguy.id);
                const newNote = await Note.findByIdAndUpdate(id, {has_ac:new_ac_ar});
                res.json({message:`Successfully Shared the note with ${userguy.name}`, data:newNote});
            }
        }
    }
};


const removeAccess = async (req, res, next)=>{
    const id = req.params.id;
    const user = req.params.name;
    const userguy = await User.findOne({name:user});
    const note = await Note.findById(id);
    if(!note){
        res.json({message:"Not Found any note with this ID"});
    }
    else if(!userguy){
        res.json({message:"User Not Found"});
    }
    else{
        if(note.author != req.user.name){
            res.status(401).json({message:"You are not authorized to share this note!"});
        }
        if(note.author == user){
            res.json({message:"You cant do this is with a personal note, instead delete it", data:"CANT"})
        }
        else{
            if(note.has_ac.includes(userguy.id)){
                const new_ = note.has_ac.filter((val)=>{return val!=userguy.id;});
                const newNote = await Note.findByIdAndUpdate(id, {has_ac:new_});
                res.json({message:`Successfully De-Shared the note with ${userguy.name}`, data:newNote});
            }
            else{
                res.json({message:`The note was not shared with ${userguy.name} in the first place`, data:"NOTSHARED"});
            }
        }
    }
};

module.exports = {addAccess, removeAccess};