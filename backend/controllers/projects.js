const members = require("../models/members");
const projects = require("../models/projects");
const multer = require('multer');
const fs = require('fs');
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
      res.json(member);
    } else {
      res.status(404).json({ error: "Member not found" });
    }
  } catch (err) {
    res.status(400).send(err);
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
          return res.status(404).json({ error: "Project not found" });
        }
      }
      // console.log(projectData);
      res.json(projectData);
    } else {
      return res.status(404).json({ error: "Member not found" });
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer middleware with defined storage
const upload = multer({ storage: storage });

// Handle image upload
exports.imageUpload = (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: 'Failed to upload image' });
    }
    const { filename, mimetype, size } = req.file;
    return res.json({ filename: filename });
    
  });
};

exports.findAuth = async(req, res, next) => {
  try {
    const member_id = req.query.member_id;
    console.log(`user id: ${member_id}`);
    // console.log('findAuth 실행중');
    // const member = await projects.findById(member_id, "member_ids");
    const project = await projects.findOne({member_ids : member_id});
    
    if (project) {
      const admin = project.admin_id;
      const managers = project.manager_ids;
      console.log(`admin: ${admin}`);
      console.log(`manager: ${managers}`);

      const jsonData = {admin_id: admin, manager_ids: []};
      for (const manager of managers) {
        jsonData.manager_ids.push(manager);
      }
      res.json(jsonData);
    } else {console.log('가져오기 실패');}
  } catch(err) {
    return res.status(400).send(err);
  }

};