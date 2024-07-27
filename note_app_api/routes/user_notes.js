
// CRUD Note and share note
const express = require('express');
const { authenticate, caseauthenticate } = require('../middleware/auth');
const {createNote, getNote, getNotes, updateNote, deleteNote, getAllPublicNotes, getMynotes, checkEditAccess} = require('../controllers/crud_notes');
const {addAccess, removeAccess}= require("../controllers/share_notes");
const router = express.Router();

router.get('/pub/all', getAllPublicNotes);
router.get('/check/:id', authenticate, checkEditAccess);
router.get('/usernotes',authenticate, getMynotes);
router.get('/see/:id', caseauthenticate, getNote);
router.get('/all', authenticate, getNotes);
router.post('/create', authenticate, createNote);
router.post('/update/:id', authenticate, updateNote);
router.delete('/delete/:id', authenticate, deleteNote);

router.post('/share/:id/:name', authenticate, addAccess);
router.post('/deshare/:id/:name', authenticate, removeAccess);
module.exports = router;