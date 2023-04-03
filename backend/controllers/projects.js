const projects = require('../models/projects');

exports.save = (req, res) => {
  
  projects.create({
      name: req.body.name,
      description: req.body.description,
      picture: req.body.picture,
      member_ids: req.body.member_id,
      admin_ids: req.body.member_id // 만든 사람은 관리자에도 추가
    })
    .then((doc) => res.status(201).json({ id: doc._id }))
    .catch((err) => res.status(400).send(err))
}

// 로그인시 가입되어있는 프로젝트 띄우기
exports.findProjects = async(req, res) => {
  const member_id = req.query.member_id;
  // console.log(member_id);
  try {
    const datas = await projects.find({ member_ids: { $in: [member_id] } });
    res.json(datas);
  } catch (err) {
    res.status(500).send(err);
  }
};