const memberController = require('../controllers/members');
const projectController = require('../controllers/projects');

module.exports = (app) => {
  app.post('/api/member/signup', memberController.signUp);
  app.post('/api/member/signin', memberController.signIn);
  app.post('/api/member/chkPw', memberController.chkPW);

  // project
  app.post('/api/project', projectController.save);
  app.get('/api/project', projectController.findProjects);
  app.patch('/api/project', projectController.updateProject);
  app.delete('/api/project', projectController.deleteProject);

  app.post('/api/project/upload', projectController.imageUpload);
  app.get('/api/project/authority/', projectController.findAuth);

  app.get('/api/project/members', projectController.findMembers);
};