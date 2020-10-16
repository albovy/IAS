const User = require("../models/User");

class UserController {
  constructor() {}

  register(req, res, next) {
    let user = new User();
    console.log(req.body);
    user.username = req.body.username;
    user.password = req.body.password;
    console.log(req.body);
    console.log("holaa");

    if (JSON.stringify(req.body) == "{}") {
      return res.status(404).json({mesage: "Body empty"});
    } else {
      user.save((err, doc) => {
        console.log("cachis");
        if (!err) {
          return res.status(200).json({message: "OK"});
        } else {
          console.log(err);
          if (err.code == 11000) {
            return res.status(422).json({message:"Duplicate username found."});
          }
          return next(err);
        }
      });
    }
  }

  login(req, res, next) {
    User.findOne({ username: req.body.username }, (err, user) => {
      if (err) return next(err);
      else if (!user) return res.status(404).json({message: "User not found"});
      else if (!user.verifyPassword(req.body.password))
        return res.status(403).json({message: "Password doesn't match"});
      else if (user)
        res.cookie('token', user.generateJwt(), {httpOnly: true}).status(200).json({ message: "OK" });
      else next();
    });
  }
}

module.exports = new UserController();
