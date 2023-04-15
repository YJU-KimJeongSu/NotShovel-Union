const members = require('../models/members');

exports.signUp = (req, res, next) => {
  members.findOne({ email: req.body.email })
    .then((data) => {
      if (!data) {
        members.create({
          email: req.body.email,
          password: req.body.password,
          name: req.body.name,
          phone_number: req.body.phone_number,
        })
          .then(() => res.status(201).send('ok')) // 201 - POST 명령 실행 및 성공
          .catch((err) => res.status(500).send(err)) // 500 - 내부 서버 오류. 존재하는 아이디가 아닌데 create 실패했으니 내부 오류
      } else {
        res.status(409).send('duplicate email') // 409 - 리소스 충돌
      }
    })
};

exports.signIn = (req, res, next) => {
  members.findOne({
    email: req.body.email,
    password: req.body.password,
  })
    .then((data) => {
      if (data) {
        if (data.state === "0") {
          res.status(404).send('Member not found');
        } else {
          res.status(201).send({ member_id: data._id, name: data.name });
        }
      } else {
        res.status(401).send('wrong'); // 401 - 사용자 자격 증명 실패
      }
    })
    .catch((err) => { res.status(500).send(err) })
};

exports.editMember = (req, res, next) => {
  const filter = { _id: req.body.member_id };
  const update = {
    name: req.body.name,
    password: req.body.password,
    phone_number: req.body.phone_number
  };
  const option = { new: true };
  members.findOneAndUpdate(filter, update, option)
  .then((data) => {
    res.status(201).send({ name: data.name });
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  }
  
exports.deleteMemeber = (req, res, next) => {
  const filter = {
    _id: req.body.member_id,
    password: req.body.password
  };
  const update = { state: "0" };
  const option = { new: true };
  members.findOneAndUpdate(filter, update, option)
    .then((data) => {
      if (!data) {
        res.status(404).send('Member not found');
      } else {
        res.status(201).send();
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    })
}