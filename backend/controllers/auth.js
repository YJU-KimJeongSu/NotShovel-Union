const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const members = require('../models/members');

exports.signUp = async (req, res, next) => {
  try {
    const member = await members.findOne({ email: req.body.email });
    if (member) return res.status(409).send({ error: 'duplicate email' });

    const phoneCheck = await members.findOne({ phone_number: req.body.phone_number });
    if (phoneCheck) return res.status(409).send({ error: 'duplicate phone' });

    const newMember = {
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 11),
      name: req.body.name,
      phone_number: req.body.phone_number,
    };
    await members.create(newMember);
    return res.status(201).send();
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.signIn = (req, res, next) => {
  passport.authenticate('local', (authError, member, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!member) {
      return res.status(401).send('wrong');
    }
    
    // 로그인에 성공한 경우, 토큰 생성 및 발급
    const token = jwt.sign (
      { memberId: member._id, email: member.email }, 
      process.env.JWT_SECRET,
      { expiresIn: '2h' } 
    );

    const loginData = {
      member_id: member._id,
      name: member.name,
      image:
        member.image ||
        'https://notshovel-union-bucket.s3.ap-northeast-2.amazonaws.com/defaultImage.png',
      token: token 
    };
    return res.status(201).send(loginData);
  })(req, res, next);
};

