const authController = require('../controllers/auth');
const memberController = require('../controllers/members');
const projectController = require('../controllers/projects');
const ganttController = require('../controllers/gantt_charts');
const boardController= require('../controllers/common/board');
const meetingController = require('../controllers/meeting_minutes');
const chatController = require('../controllers/chattings');
const s3Controller = require('../controllers/s3');
const { isNotLoggedIn, verifyToken, apiLimiter } = require('../middlewares');

module.exports = (app) => {
  //auth
  app.post('/api/auth/signup', isNotLoggedIn, authController.signUp);
  app.post('/api/auth/signin', isNotLoggedIn, authController.signIn);
  
  //member
  app.patch('/api/member/edit',  verifyToken, apiLimiter, memberController.editMember);
  app.delete('/api/member/delete', verifyToken, apiLimiter, memberController.deleteMemeber);
  app.post('/api/member/chkPw', verifyToken, apiLimiter, memberController.chkPW);
  app.get('/api/member/emailAuth', apiLimiter, memberController.emailAuth);
  app.get('/api/member/chkEmail', isNotLoggedIn, apiLimiter, memberController.chkEmail);
  app.patch('/api/member/passwordReset', isNotLoggedIn, apiLimiter, memberController.passwordReset);

  // project
  app.post('/api/project', verifyToken, apiLimiter, projectController.save);
  app.get('/api/project', verifyToken, apiLimiter, projectController.findProjects);
  app.patch('/api/project', verifyToken, apiLimiter, projectController.updateProject);
  app.delete('/api/project', verifyToken, apiLimiter, projectController.deleteProject);
  
  // app.post('/api/project/upload', projectController.imageUpload);
  app.get('/api/project/authority', verifyToken, apiLimiter, projectController.findAuth);

  app.get('/api/project/members', verifyToken, apiLimiter, projectController.findMembers);
  app.post('/api/project/grade', verifyToken, apiLimiter, projectController.changeGrade);
  app.delete('/api/project/exit', verifyToken, apiLimiter, projectController.exitProject);
  app.patch('/api/project/register', verifyToken, apiLimiter, projectController.registerToProject);
  
  // gantt
  app.post('/api/gantt', verifyToken, apiLimiter, ganttController.save);
  app.get('/api/gantt/:board_id', verifyToken, apiLimiter, ganttController.getGanttData);

  // board
  app.patch('/api/board/order', verifyToken, apiLimiter, boardController.changeBoardOrder);
  app.post('/api/board', verifyToken, apiLimiter, boardController.createBoard);
  app.get('/api/board', verifyToken, apiLimiter, boardController.getBoardList);
  app.delete('/api/board/:bid/:btype', apiLimiter, boardController.deleteBoard);
  app.patch('/api/board', apiLimiter, boardController.updateBoard);

  
  // meeting_minutes
  app.post('/api/meeting', verifyToken, apiLimiter, meetingController.save);
  app.patch('/api/meeting', verifyToken, apiLimiter, meetingController.update);
  app.delete('/api/meeting', verifyToken, apiLimiter, meetingController.deleteMeetingMinute);
  app.get('/api/meeting/chat', verifyToken, apiLimiter, meetingController.getMinuteChattings);
  app.get('/api/meeting/:id', verifyToken, apiLimiter, meetingController.getAllList);
  app.get('/api/meeting/:boardId/:id', verifyToken, apiLimiter, meetingController.getDetailMeetingMinute);
  app.post('/api/meeting/chat', verifyToken, apiLimiter, meetingController.saveMinuteChattings);

  // chattings
  app.post('/api/chat', verifyToken, apiLimiter, chatController.insertChat);
  app.get('/api/chat/list', verifyToken, apiLimiter, chatController.getChatList);

  // s3
  app.get('/api/s3/url', verifyToken, apiLimiter, s3Controller.getPresignedURL);
};