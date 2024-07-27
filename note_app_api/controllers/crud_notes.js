
const Note = require('../models/note');
const User = require('../models/user');
 
const createNote = async (req,res,next)=>{
    const {text, public} = req.body;
    const username = req.user.name;
    const now = new Date();
    const note = new Note({text:text, isPub:public, createtime:now, author:username});
    note.save();
    const ac_ar = note.has_ac;
    ac_ar.push(req.user.id);
    const newNote = await Note.findOneAndUpdate({id:note.id}, {has_ac:ac_ar});
    // now adding this to the user's notes
    req.user.notes.push(note.id);
    const user = await User.findOneAndUpdate({name:username}, {notes:req.user.notes});
    res.json({message:"Note added", NoteData:note, userdata:user});
};

const getNote = async (req,res,next)=>{
    const user =req.user
    const noteid = req.params.id;
    const note = await Note.findById(noteid);
    if(note){    
        if(user && note.has_ac.includes(user.id)){
            res.json({message:"Since u did specify an id we give u the note", data:note});
        }
        else if(note.isPub){
            res.json({mesaage:"Since its public, You can view", data:note});
        }
        else{
            res.json({message:"You dont have access to this note.", data:null});
        }}
    else{
            res.json({message:"Not Found any note with this ID", data:null});
    }
    
};
const checkEditAccess = async (req, res, next)=>{
    const userid =req.user.id;
    const noteid = req.params.id;
    const note = await Note.findById(noteid);
    if(note){    
        if(note.has_ac.includes(userid)){
            res.json({message:"Since u did specify an id we give u the note", data:true});
        }
        else{
            res.json({message:"You dont have access to this note.", data:false});
        }}
    else{
            res.json({message:"Not Found any note with this ID", data:null});
    }
};
const getMynotes = async (req ,res,next)=>{
    const allNotes = await Note.find({author:req.user.name});
    if(allNotes){    
            res.json({message:"Since u didnt specify an id we give u the notes u wrote", data:allNotes});
        }
    else{
            res.json({message:"Not Found any note with this author", data:null});
    }
};
const getNotes = async (req, res, next)=>{
    const allNotes = await Note.find({has_ac:req.user.id});
    res.json({message:"Since u didnt specify any id we give u all notes which are accessible by the user", data:allNotes});
};

const updateNote = async (req, res, next)=>{
    const noteid = req.params.id;
    const {text, public} = req.body;
    const note = await Note.findById(noteid);
    if(!note){
        res.json({message:"Not Found any note with this ID", data:null});
    }
    else{
        if(!note.has_ac.includes(req.user.id)){
            res.json({message:"You are not authorized to edit this note!", data:null});
        }
        else{
            const newNote = await Note.findByIdAndUpdate(noteid, {text:text, isEdit:true, isPub:public});
            res.json({message:"Successfully updated", data:newNote});
        }
    }
};

const deleteNote = async (req, res, next)=>{
    const noteid = req.params.id;
    const note = await Note.findById(noteid);
    if(!note){
        res.json({message:"Not Found any note with this ID", data:false});
    }
    else{
        if(note.author != req.user.name){
            res.json({message:"You are not authorized to delete this note!", data:false});
        }
        else{
            const newNote = await Note.findByIdAndDelete(noteid);
            res.json({message:"Successfully deleted",data:true});
        }
    }
};

const getAllPublicNotes = async (req, res, next)=>{
    const notes = await Note.find({isPub:true});
    if(notes){
        res.json({message:"Got em", data:notes});
    }
    else{
        res.json({message:"No public notes"});
    }
};
module.exports = {createNote, getNote, getNotes, updateNote, deleteNote, getAllPublicNotes,checkEditAccess, getMynotes};