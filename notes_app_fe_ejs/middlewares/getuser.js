const axios = require('axios');

const getUser = (req, res, next)=>{
    if(req.cookies.jwt){
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${backendApiUrl}/user/getuserinfo`,
            headers: { 
              'Authorization': `Bearer ${req.cookies.jwt}`
            }
          };
        axios.request(config)
            .then((response) => {
                req.user = response.data.data;
                next();
            })
            .catch((error) => {
                res.redirect(`/e/invalid-token/warning/`)
            });
    }
    else{
        req.user = null;
        next();
    }

};

module.exports = getUser;