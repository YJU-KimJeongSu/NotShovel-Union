const gantt_charts = require("../../models/gantt_charts");
const meeting_minutes = require("../../models/meeting_minutes");
const chattings = require("../../models/chattings");
const projects = require("../../models/projects");


exports.changeBoardOrder = async (req, res) => {
  console.log('from change board event backend에서 수신');
  const project_id = req.query.project_id;

  try {
    const bList = req.body;
    console.log(bList);
    console.log('bList prjid ' + project_id);
    console.log('bList length ' + bList.length);
    
    for(let i = 0; i < bList.length; i++) {
      try {
        console.log(`Updating board_order from ${bList[i].board_order} to ${-1 * (bList[i].newOrder + 1)}`);
        await meeting_minutes.findOneAndUpdate(
          { project_id: project_id , board_order: bList[i].board_order},
          { $set: { board_order: -1 * (bList[i].newOrder + 1) } },
        );
      } catch(err) {
        console.log(err);
      }
    }

    // Update the temporary negative board orders to their final values
    for(let i = 0; i < bList.length; i++) {
      try {
        console.log(`Updating board_order from ${-1 * (bList[i].newOrder + 1)} to ${bList[i].newOrder}`);
        await meeting_minutes.findOneAndUpdate(
          { project_id: project_id , board_order: -1 * (bList[i].newOrder + 1) },
          { $set: { board_order: bList[i].newOrder } },
        );
      } catch(err) {
        console.log(err);
      }
    }

  } catch(err) {
    console.log(err);
  }   
};

exports.getBoardList = async (req, res) => {
  console.log('from getboardList backend에서 송신');
  try {
    const project_id = req.query.project_id;
    console.log(`projectID: ${project_id}`);
    let boards = [];
    
const meetingMinutes = await meeting_minutes.find({ project_id: project_id }).sort({ board_order: 1 });
    
    meetingMinutes.forEach(meeting => {
      // 자바 스크립트 객체로 변환
      let meetingObj = meeting.toObject();
      meetingObj.type = 'meetingMinutes';
      meetingObj.icon = 'bx bx-folder';
      meetingObj.clickMethod = 'meetingMinutes';
      console.log(`meeting N order: ${meeting.board_order}`);
      
      boards.push(meetingObj);
    });
    
    res.json(boards);
  } catch(err) {
    console.log("-------------------------- err --------------");
    console.log(err);
  }

  

    
};


exports.createBoard = async (req, res) => {
  const project_id = req.query.project_id;
  console.log(`project_id: ${project_id}`);
  console.log(`추가될 순서: ${req.body.listIndex}`);
  const type = req.body.type;

  // 게시판 type에 따라서 저장 되는 model이 바뀜
  switch(type) {
    case 'meetingMinutes':
      try {
        await meeting_minutes.create({
          project_id: req.query.project_id,
          board_name: req.body.name,
          board_order: req.body.listIndex
        });
        console.log('미팅 게시판 저장 성공');
      } catch(err) {
        console.log(err);
      }
    }
  
};