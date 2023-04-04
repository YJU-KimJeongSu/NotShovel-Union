const members = require('../models/members');

exports.signUp = (req, res, next) => {
    // 중복 검사 먼저 실행
    members.findOne({email: req.body.email})
    .then((data) => {
        if (!data) { // 정상 (이미 가입된 아이디 없음)
            members.create({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                phone_number: req.body.phone_number
            })
            .then(() => res.status(201).send('ok')) // 201 - POST 명령 실행 및 성공
            .catch((err) => res.status(500).send(err)) // 500 - 내부 서버 오류. 존재하는 아이디가 아닌데 create 실패했으니 내부 오류
        } else { // 이미 존재하는 아이디
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
        // console.log(data._id);
        if (data) { // 정상 (로그인 성공)
            res.status(201).send(data._id);
        } else { // 없는 회원
            res.status(401).send('wrong'); // 401 - 사용자 자격 증명 실패
        }
    })
    .catch((err) => { res.status(500).send(err) })
};