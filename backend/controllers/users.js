const users = require('../models/users');

exports.login = (req, res, next) => {
    users.findOne({ 
      email: req.body.email
    })
    .then((data)=> {
      if(req.body.password === data.password){
        res.send({name: data.name});
      }
      else {
        res.send('wrong');
      }
    })
    .catch((err) => res.status(400).send(err))
};


exports.signup = (req, res) => {
    users.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
    .then(() => res.status(201).send('ok'))
    .catch((err) => res.status(400).send(err))
}
