const chattings = require("../models/chattings");
const meetingMinutes = require("../models/meeting_minutes");

exports.save = async (req, res) => {
  try {
    const { board_id, title, date, context, place, member_id } = req.body;

    const meeting_minutes = {
        title,
        date,
        context,
        place,
        member_ids: member_id,
    }

    const result = await meetingMinutes.findOneAndUpdate(
      { _id: board_id },
      { $push: {meeting_minutes} },
      { new: true }, 
      { upsert: true }
    );

    res.status(200).json({ message: "회의록 저장 완료", result: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "회의록 저장 실패" });
  }
};

exports.update = async (req, res) => {
  try {
    const { board_id, title, date, context, place, member_id, meetingMinuteId } = req.body;

    const updatedMeetingMinutes = { 
      title,
      date,
      context,
      place,
      member_ids: member_id
    };

    const result = await meetingMinutes.findOneAndUpdate(
      { "_id": board_id, "meeting_minutes._id": meetingMinuteId },
      { $set: {
          "meeting_minutes.$.title": title,
          "meeting_minutes.$.date": date,
          "meeting_minutes.$.context": context,
          "meeting_minutes.$.place": place,
          "meeting_minutes.$.member_ids": member_id
        }
      }, 
      { new: true }
    );
    
    res.status(200).json({ message: "회의록 저장 완료", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "회의록 저장 실패" });
  }
};

// exports.getAllList = async (req, res) => {
//   try {
//     const project_id = req.params.id;
//     const result = await meetingMinutes.findOne({ project_id }, { "_id": false, "meeting_minutes": true });
//     // console.log(result.meeting_minutes);

//     const data = result.meeting_minutes.map((minute) => {
//       return {
//         title: minute.title,
//         date: minute.date,
//         member_ids: minute.member_ids,
//       };
//     });
//     console.log(data);
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.getAllList = async (req, res) => {
  try {
    const boardId = req.params.id;
    const result = await meetingMinutes
      .findOne({ _id: boardId }, { "_id": true, "meeting_minutes": true })
      .populate({
        path: 'meeting_minutes.member_ids',
        model: 'members',
        select: 'name',
      });

    const data = result.meeting_minutes.map((minute) => {
      return {
        _id: minute._id,
        title: minute.title,
        date: minute.date,
        writer_name: minute.member_ids.name,
      };
    });
    console.log(data);

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "회의록 불러오기 실패" });
  }
};

exports.getDetailMeetingMinute = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const _id = req.params.id;

    const meetingMinute = await meetingMinutes.findOne(
      { _id: boardId, "meeting_minutes._id": _id },
      { "meeting_minutes.$": 1 }
    );
    console.log(meetingMinute.meeting_minutes[0]);

    res.status(200).json(meetingMinute.meeting_minutes[0]);

    return res.status(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "회의록 불러오기 실패" });
  }


  // 회의록 채팅 저장 추가
};
exports.saveMinuteChattings = async(req, res) => {
  const chattings = req.body;
  // console.log('왜 이상한거 저장되냐고 ' + chattings.minute_id);

  try {  
    const meetingMinute = await meetingMinutes.findOneAndUpdate(
      { _id: chattings.board_id },
      { $push: {
          meeting_chattings: {
            roomName: chattings.minute_id,
            context: chattings.context,
            type: chattings.type,
            member_id: chattings.member_id,
            name: chattings.name
        }
      }}
    );
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: "채팅 불러오기 실패" });
  }
};



// 회의록 채팅 불러오기 추가
exports.getMinuteChattings = async(req, res) => {
  const board_id = req.query.board_id;
  const minute_id = req.query.minute_id;

  try {  
    const readChat = await meetingMinutes.findOne(
      { _id: board_id}
    ).populate('meeting_chattings.member_id');


    let chatLogs = [];
    readChat.meeting_chattings.forEach((chat) => {
      if(chat.roomName == minute_id) {
        chatLogs.push(chat);
      }
    });

    res.status(200).json(chatLogs);
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: "채팅 불러오기 실패" });
  }
};