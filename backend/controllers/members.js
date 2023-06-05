const members = require('../models/members');
// const multer = require('multer');
const path = require('path');
const { smtpTransport } = require('../config/email');
const bcrypt = require('bcrypt');

exports.editMember = async (req, res, next) => {
  const filter = { _id: req.body.member_id };
  const update = {
    name: req.body.name,
    password: await bcrypt.hash(req.body.password, 11),
    phone_number: req.body.phone_number,
    // image: req.body.image
  };
  const option = { new: true };
  await members.findOneAndUpdate(filter, update, option)
    .then((data) => {
      // return res.status(201).send({ name: data.name, image: data.image || 'DefaultImage.png' });
      return res.status(201).send({ name: data.name });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    })
}

exports.deleteMemeber = async (req, res, next) => {
  const reqPassword = req.body.password;
  const filter = { _id: req.body.member_id };
  const update = { state: "0" };
  const option = { new: true };

  try {
    const member = await members.findOne(filter);
    if (!member) return res.status(500); // 멤버 못 찾았을 때. 일반적으론 못 찾을 이유 없음

    bcrypt.compare(reqPassword, member.password, async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else if (result) { // 정상
        await members.findOneAndUpdate(filter, update, option);
        return res.status(201).send();
      } else { // 비밀번호 틀림
        return res.status(404).send('Wrong Password');
      }
    })
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
}

// exports.imageUpload = (req, res, next) => {
//   const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public/profile');
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + path.extname(file.originalname));
//     }
//   });
//   const upload = multer({ storage: storage });

//   upload.single('image')(req, res, function (err) {
//     if (err) {
//       return res.status(400).json({ message: 'Failed to upload image' });
//     }
//     const { filename } = req.file;
//     return res.json({ filename: filename });
//   });
// }

// 프로젝트 제거 시
exports.chkPW = async (req, res) => {
  const { id, password } = req.body;

  try {
    const member = await members.findOne({_id: id});
    if (!member) return res.status(500).send(); //멤버 못 찾았을 때. 일반적으론 못 찾을 이유 없음

    bcrypt.compare(password, member.password, (err, result) => {
      if (err) return res.status(500).send(err);
      if (result) return res.status(201).json({message: '비밀번호 일치'});
      else return res.status(401).json({message: '비밀번호 일치X'});
    });
  } catch (error) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.emailAuth = async (req, res) => {
  const num = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111; // 111111 ~ 999999
  // const userEmail = req.body.email;
  const userEmail = req.query.email;

  console.log(userEmail);
  const mailOptions = {
    from: "Union@gmail.com",
    to: userEmail,
    subject: "[Union] 회원가입 인증 메일입니다.",
    text: "다음 숫자를 입력해주세요 : " + num
  };

  await smtpTransport.sendMail(mailOptions, (err, result) => {
    if (err) return res.status(400).send(err);
    else return res.status(200).json({num: num});
  });
  
  smtpTransport.close();
}
