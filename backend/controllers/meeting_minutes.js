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
      { $set: { "meeting_minutes.$": updatedMeetingMinutes} }, 
      { new: true } 
    );

    res.status(200).json({ message: "회의록 저장 완료", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "회의록 저장 실패" });
  }
};
