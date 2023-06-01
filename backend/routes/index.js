const authController = require('../controllers/auth');
const memberController = require('../controllers/members');
const projectController = require('../controllers/projects');
const ganttController = require('../controllers/gantt_charts');
const boardController= require('../controllers/common/board');
const meetingController = require('../controllers/meeting_minutes');
const chatController = require('../controllers/chattings');
const s3Controller = require('../controllers/s3');
const { isLoggedIn, isNotLoggedIn, verifyToken } = require('../middlewares');

module.exports = (app) => {
  //auth
  app.post('/api/auth/signup', isNotLoggedIn, authController.signUp);
  app.post('/api/auth/signin', isNotLoggedIn, authController.signIn);
  
  //member
  app.patch('/api/member/edit',  verifyToken, memberController.editMember);
  app.delete('/api/member/delete', verifyToken, memberController.deleteMemeber);
  app.post('/api/member/image', verifyToken, memberController.imageUpload);
  app.post('/api/member/chkPw', verifyToken, memberController.chkPW);
  app.get('/api/member/emailAuth', memberController.emailAuth);

  // project
  app.post('/api/project', verifyToken, projectController.save);
  app.get('/api/project', verifyToken, projectController.findProjects);
  app.patch('/api/project', verifyToken, projectController.updateProject);
  app.delete('/api/project', verifyToken, projectController.deleteProject);
  
  // app.post('/api/project/upload', projectController.imageUpload);
  app.get('/api/project/authority', verifyToken, projectController.findAuth);

  app.get('/api/project/members', verifyToken, projectController.findMembers);
  app.post('/api/project/grade', verifyToken, projectController.changeGrade);
  app.delete('/api/project/exit', verifyToken, projectController.exitProject);
  app.patch('/api/project/register', verifyToken, projectController.registerToProject);
  
  // gantt
  app.post('/api/gantt', verifyToken, ganttController.save);
  app.get('/api/gantt/:board_id', verifyToken, ganttController.getGanttData);

  // board
  app.patch('/api/board/order', verifyToken, boardController.changeBoardOrder);
  app.post('/api/board', verifyToken, boardController.createBoard);
  app.get('/api/board', verifyToken, boardController.getBoardList);
  
  // meeting_minutes
  app.post('/api/meeting', verifyToken, meetingController.save);
  app.patch('/api/meeting', verifyToken, meetingController.update);
  app.delete('/api/meeting', verifyToken, meetingController.deleteMeetingMinute);
  app.get('/api/meeting/chat', verifyToken, meetingController.getMinuteChattings);
  app.get('/api/meeting/:id', verifyToken, meetingController.getAllList);
  app.get('/api/meeting/:boardId/:id', verifyToken, meetingController.getDetailMeetingMinute);
  app.post('/api/meeting/chat', verifyToken, meetingController.saveMinuteChattings);

  // chattings
  app.post('/api/chat', verifyToken, chatController.insertChat);
  app.get('/api/chat/list', verifyToken, chatController.getChatList);

  // s3
  app.get('/api/s3/url', verifyToken, s3Controller.getPresignedURL);
};