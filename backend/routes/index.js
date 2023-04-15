const memberController = require('../controllers/members');
const projectController = require('../controllers/projects');

module.exports = (app) => {
  //member
  app.post('/api/member/signup', memberController.signUp);
  app.post('/api/member/signin', memberController.signIn);
  app.patch('/api/member/edit', memberController.editMember);
  app.delete('/api/member/delete', memberController.deleteMemeber);
  app.post('/api/member/image', memberController.imageUpload);
  // project
  app.post('/api/project', projectController.save);
  app.get('/api/project', projectController.findProjects);
  app.post('/api/project/upload', projectController.imageUpload);
};