const memberController = require('../controllers/members');
const projectController = require('../controllers/projects');

module.exports = (app) => {
  //member
  app.post('/api/member/signup', memberController.signUp);
  app.post('/api/member/signin', memberController.signIn);
  app.patch('/api/member/edit', memberController.editMember);
  app.delete('/api/member/delete', memberController.deleteMemeber);
  app.post('/api/member/image', memberController.imageUpload);
  app.post('/api/member/chkPw', memberController.chkPW);

  // project
  app.post('/api/project', projectController.save);
  app.get('/api/project', projectController.findProjects);
  app.patch('/api/project', projectController.updateProject);
  app.delete('/api/project', projectController.deleteProject);

  app.post('/api/project/upload', projectController.imageUpload);
  app.get('/api/project/authority/', projectController.findAuth);
  app.get('/api/project/members', projectController.findMembers);
  app.delete('/api/project/exit', projectController.exitProject);
  app.patch('/api/project/register', projectController.registerToProject);
};