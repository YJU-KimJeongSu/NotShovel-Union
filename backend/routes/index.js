const userController = require('../controllers/users');

module.exports = (app) => {

  // app.post('/api/user/login', userController.userLogin);
  app.post('/api/user/', userController.login);
};