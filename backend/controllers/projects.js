const members = require("../models/members");
const projects = require("../models/projects");
const multer = require('multer');
const path = require('path');

exports.save = async (req, res) => {
  try {
    const member_id = req.body.member_id;
    const project = await projects.create({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      member_ids: member_id,
      admin_id: member_id, // 만든 사람은 관리자에도 추가
    });

    // 만들고 나서 members 안에 있는 프로젝트에도 추가
    const project_id = project._id;
    const member = await members.findOneAndUpdate(
      { _id: member_id },
      { $push: { project_ids: project_id } },
      { new: true }
    );

    if (member) {
      res.json({ id: project_id }); // 원래 member 객체를 보냈으나, member는 안쓰이는 것 같아서 project_id만 보내게 수정
    } else {
      res.status(404).send();
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

// 로그인시 가입되어있는 프로젝트 띄우기
exports.findProjects = async (req, res) => {
  try {
    const member_id = req.query.member_id;
    const member = await members.findById(member_id, "project_ids");
    if (member) {
      const project_ids = member.project_ids;
      const projectData = [];

      for (const project_id of project_ids) {
        const project = await projects.findById(project_id);
        if (project) {
          const name = project.name;
          const description = project.description;
          const image = project.image;
          const id = project._id;

          projectData.push({
            id: id,
            name: name,
            description: description,
            image: image,
          });
        } else {
          return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다.' });
        }
      }
      // console.log(projectData);
      return res.json(projectData);
    } else {
      return res.status(404).json({ error: '회원을 찾을 수 없습니다.' });
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};



exports.imageUpload = (req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });

  upload.single('image')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: '이미지 업로드 실패' });
    }
    const { filename, mimetype, size } = req.file;
    return res.json({ filename: filename });

  });
};

exports.findAuth = async (req, res, next) => {
  // try {
    console.log('findAuth----------');
    const project_id = req.query.project_id;
    console.log(`prj_id findAuth: ${project_id}`)
    // console.log(`user id: ${member_id}`);
    // console.log('findAuth 실행중');
    // const member = await projects.findById(member_id, "member_ids");
    const project = await projects.findOne({ _id: project_id});
    return res.json(project);

  //   if (project) {
  //     const admin = project.admin_id;
  //     const managers = project.manager_ids;
  //     // console.log(`admin: ${admin}`);
  //     // console.log(`manager: ${managers}`);

  //     const jsonData = { admin_id: admin, manager_ids: [] };
  //     for (const manager of managers) {
  //       jsonData.manager_ids.push(manager);
  //     }
  //     return res.json(jsonData);
  //   } else { console.log('가져오기 실패'); }
  // } catch (err) {
  //   return res.status(400).send(err);
  // }
};

exports.updateProject = async (req, res) => {
  try {
    const { name, description, image, project_id } = req.body;

    const updatedProject = await projects.findByIdAndUpdate(project_id, {
      name,
      description,
      image
    }, { new: true });

    if (updatedProject) {
      return res.status(200).json(updatedProject);
    } else {
      return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다.' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project_id = req.body.project_id;

    const deleteProject = await projects.deleteOne({ _id: project_id });
    if (deleteProject.deletedCount > 0) {
      await members.updateMany({}, { $pull: { project_ids: project_id } });
      return res.status(200).json({ message: '프로젝트가 삭제되었습니다.' });
    } 
    else {
      return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다.' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.findMembers = async (req, res) => {
  const project_id = req.query.project_id;
  try {
    const project = await projects.findOne({_id: project_id}).populate('member_ids'); // 멤버 정보를 populate로 가져옴
    if (project) {
      const members = project.member_ids.map(member => {
        return {
          id: member._id,
          email: member.email,
          name: member.name,
          phone: member.phone_number
        };
      });
      return res.status(200).json(members);
    } else {
      return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다.' });
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.changeGrade = async (req, res) => {
  const project_id = req.body.project_id;
  const member_id = req.body.member_id;
  const grade = req.body.grade;

  try {
    const project = await projects.findById(project_id);
    if(grade==='member'){
      project.manager_ids.pull(member_id);
      await project.save();
      return res.status(200).json({ msg: "일반 멤버로 변경되었습니다." });
    }
    else if(grade==='manager'){
      project.manager_ids.push(member_id);
      await project.save();
      res.status(200).json({ msg: "매니저로 변경되었습니다." });
    } 
    else {
      return res.status(404).json({ msg: "등급 변경 실패" });;
    }
  } catch (err) {
    console.error(err);
    res.status(500);
  }
};

exports.exitProject = async (req, res) => {
  const { member_id, project_id } = req.body;

  try {
    const data = await projects.findOne({ _id: project_id });

    if (member_id == data.admin_id) { // 어드민은 탈퇴 불가능
      return res.status(403).send('admin');
    } else { // 어드민이 아니면 그냥 탈퇴
      const filter = { _id: member_id };
      const update = {
        $pull: {
          project_ids: { $in: project_id }
        }
      };
      const option = { new: true };

      await members.findOneAndUpdate(filter, update, option);

      const filter2 = { _id: project_id };
      const update2 = {
        $pull: {
          manager_ids: { $in: member_id },
          member_ids: { $in: member_id }
        }
      };
      const option2 = { new: true };

      await projects.findOneAndUpdate(filter2, update2, option2);
      return res.status(200).send('exit');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

exports.registerToProject = async (req, res) => {
  const { member_id, project_id } = req.body;
  try {
    const project = await projects.findOne({ _id: project_id });

    if (project.member_ids.includes(member_id)) {
      return res.status(409).send('already exists');
    }

    const filter = { _id: project_id };
    const update = { $push: { member_ids: member_id } };
    const option = { new: true };
    await projects.findOneAndUpdate(filter, update, option);

    const filter2 = { _id: member_id };
    const update2 = { $push: { project_ids: project_id } };
    const option2 = { new: true };
    await members.findOneAndUpdate(filter2, update2, option2);

    return res.status(200).send();
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};