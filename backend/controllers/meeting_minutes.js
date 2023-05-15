const meetingMinutes = require("../models/meeting_minutes");
const members = require("../models/members");

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
      { $set: { "meeting_minutes.$": updatedMeetingMinutes} }, 
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
    const project_id = req.params.id;
    const result = await meetingMinutes
      .findOne({ project_id }, { "_id": false, "meeting_minutes": true })
      .populate({
        path: 'meeting_minutes.member_ids',
        model: 'members',
        select: 'name',
      });

    const data = result.meeting_minutes.map((minute) => {
      return {
        title: minute.title,
        date: minute.date,
        writer_name: minute.member_ids.name,
      };
    });
    console.log(data);

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
};
