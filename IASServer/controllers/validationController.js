const request = require('request');

class ValidationController {
  constructor() {}

  validateReCaptcha(req, res, next) {
    let token = req.body.recaptcha;

    //token validation url is URL: https://www.google.com/recaptcha/api/siteverify 
    // METHOD used is: POST
    
    //const url =  `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}&remoteip=${req.connection.remoteAddress}`
    const url = process.env.CAPTCHA_URL + `?secret=${process.env.CAPTCHA_SECRET}&response=${token}`;
    
    //note that remoteip is the users ip address and it is optional
    // in node req.connection.remoteAddress gives the users ip address
    
    if(token === null || token === undefined){
        res.status(201).send({success: false, message: "Token is empty or invalid"})
        return console.log("token empty");
    }
    console.log(url);
    request(url, function(err, response, body){
        //the body is the data that contains success message
        body = JSON.parse(body);
        console.log(body.success);
        //check if the validation failed
        if(!body.success){
            res.send({success: false, 'message': "recaptcha failed"});
            return console.log("failed")
        }
        
        //if passed response success message to client
        res.send({"success": true, 'message': "recaptcha passed"});
        
    })

  }

 
}

module.exports = new ValidationController();
