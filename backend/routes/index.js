const memberController = require('../controllers/members');
const projectController = require('../controllers/projects');

module.exports = (app) => {
  app.post('/api/member/signup', memberController.signUp);
  app.post('/api/member/signin', memberController.signIn);
  // project
  app.post('/api/project', projectController.save);
  app.get('/api/project', projectController.findProjects);
};