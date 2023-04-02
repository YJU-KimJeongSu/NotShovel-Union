const memberController = require('../controllers/members');

module.exports = (app) => {
  app.post('/api/member/signup', memberController.signUp);
};