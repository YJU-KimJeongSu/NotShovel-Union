const meetingMinutes = require("../models/meeting_minutes");

exports.save = async (req, res) => {
  try {
    const { project_id, board_name, board_order, title, date, context, place} = req.body;
    const meeting_minutes = await meetingMinutes.create({
        project_id,
        board_name,
        board_order,
        title,
        date,
        context,
        place,
    });

    res.status(200).json({ message: "회의록 저장 완료"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "회의록 저장 실패" });
  }
};
