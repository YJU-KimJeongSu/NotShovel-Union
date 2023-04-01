const members = require('../models/members');

exports.signUp = (req, res, next) => {
    // 중복 검사 먼저 실행
    members.findOne({
        email: req.body.email,
    })
    .then((data) => {
        if (!data) { // 정상
            members.create({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name
                // phone_number는 ui 구현을 안해서 임시로 제외
            })
            .then(() => res.status(201).send('ok')) // 201 - POST 명령 실행 및 성공
            .catch((err) => res.status(500).send(err)) // 500 - 내부 서버 오류. 존재하는 아이디가 아닌데 create 실패했으니 내부 오류
        } else { // 이미 존재하는 아이디
            res.status(400).send('duplicate email')
        }
    })
};