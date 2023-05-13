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
      { upsert: true }
    );

    res.status(200).json({ message: "회의록 저장 완료", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "회의록 저장 실패" });
  }
};