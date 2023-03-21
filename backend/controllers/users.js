const users = require('../models/users');

exports.login = (req, res, next) => {

    users.find({ email: req.body.email, password: req.body.password },(err, data) => {
      if(data.length !== 0){
        res.json({
          result: 1,
          message: "성공"
        })
      }else {
        res.json({
          result: 0,
          message: "실패"
        })
      }
    });
  };