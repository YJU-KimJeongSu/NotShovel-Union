const authController = require('../controllers/auth');
const memberController = require('../controllers/members');
const projectController = require('../controllers/projects');
const ganttController = require('../controllers/gantt_charts');
const boardController= require('../controllers/common/board');
const meetingController = require('../controllers/meeting_minutes');
const chatController = require('../controllers/chattings');
const s3Controller = require('../controllers/s3');
const { isLoggedIn, isNotLoggedIn, apiLimiter, verifyToken } = require('../middlewares');

module.exports = (app) => {
  //auth
  app.post('/api/auth/signup', isNotLoggedIn, authController.signUp);
  app.post('/api/auth/signin', isNotLoggedIn, authController.signIn);
  // app.get('/api/auth/logout', isLoggedIn, authController.logout);

  //member
  app.patch('/api/member/edit',  apiLimiter, verifyToken, memberController.editMember);
  app.delete('/api/member/delete', apiLimiter, verifyToken, memberController.deleteMemeber);
  app.post('/api/member/image', apiLimiter, verifyToken, memberController.imageUpload);
  app.post('/api/member/chkPw', apiLimiter, verifyToken, memberController.chkPW);
  app.get('/api/member/emailAuth', memberController.emailAuth);

  // project
  app.post('/api/project', apiLimiter, verifyToken, projectController.save);
  app.get('/api/project', apiLimiter, verifyToken, projectController.findProjects);
  app.patch('/api/project', apiLimiter, verifyToken, projectController.updateProject);
  app.delete('/api/project', apiLimiter, verifyToken, projectController.deleteProject);
  
  // app.post('/api/project/upload', projectController.imageUpload);
  app.get('/api/project/authority', apiLimiter, verifyToken, projectController.findAuth);

  app.get('/api/project/members', apiLimiter, verifyToken, projectController.findMembers);
  app.post('/api/project/grade', apiLimiter, verifyToken, projectController.changeGrade);
  app.delete('/api/project/exit', apiLimiter, verifyToken, projectController.exitProject);
  app.patch('/api/project/register', apiLimiter, verifyToken, projectController.registerToProject);
  
  // gantt
  app.post('/api/gantt', apiLimiter, verifyToken, ganttController.save);
  app.get('/api/gantt/:board_id', apiLimiter, verifyToken, ganttController.getGanttData);

  // board
  app.patch('/api/board/order', apiLimiter, verifyToken, boardController.changeBoardOrder);
  app.post('/api/board', apiLimiter, verifyToken, boardController.createBoard);
  app.get('/api/board', apiLimiter, verifyToken, boardController.getBoardList);
  
  // meeting_minutes
  app.post('/api/meeting', apiLimiter, verifyToken, meetingController.save);
  app.patch('/api/meeting', apiLimiter, verifyToken, meetingController.update);
  app.delete('/api/meeting', apiLimiter, verifyToken, meetingController.deleteMeetingMinute);
  app.get('/api/meeting/chat', apiLimiter, verifyToken, meetingController.getMinuteChattings);
  app.get('/api/meeting/:id', apiLimiter, verifyToken, meetingController.getAllList);
  app.get('/api/meeting/:boardId/:id', apiLimiter, verifyToken, meetingController.getDetailMeetingMinute);
  app.post('/api/meeting/chat', apiLimiter, verifyToken, meetingController.saveMinuteChattings);

  // chattings
  app.post('/api/chat', apiLimiter, verifyToken, chatController.insertChat);
  app.get('/api/chat/list', apiLimiter, verifyToken, chatController.getChatList);

  // s3
  app.get('/api/s3/url', apiLimiter, verifyToken, s3Controller.getPresignedURL);
};