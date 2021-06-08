const jwt = require("jsonwebtoken");

module.exports = {
    tokenValid: (req,res,next) => {
        console.log(req.headers);
        jwt.verify(req.headers.authorization.split(" ")[1],
        "anbya@armyAli", function(err,decoded){
            if(err){
                res.send(err);
            } else {
                next();
            }
        });
    }
}