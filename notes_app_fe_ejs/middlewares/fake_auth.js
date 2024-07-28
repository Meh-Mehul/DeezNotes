
const checkToken =  async (req, res,next) => {
    try {
        const token = req.cookies.jwt;
        if(token){
            next();
        }
        else{
            res.redirect('/');
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resource' });
    }
};
module.exports = checkToken;