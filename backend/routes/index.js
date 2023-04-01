// const userController = require('../controllers/users');
const memberController = require('../controllers/members');

module.exports = (app) => {

  // app.post('/api/user/login', userController.userLogin);
  // app.post('/api/user/login', userController.login);
  // app.post('/api/user/signup', userController.signup);
  app.post('/api/member/signup', memberController.signUp);
};