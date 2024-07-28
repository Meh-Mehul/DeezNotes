
const checkIfLoggedIn = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        res.redirect('/');
    }
    else{
        next();
    }
}
module.exports = checkIfLoggedIn;
