const ganttCharts = require("../models/gantt_charts");

exports.save = async (req, res) => {
  try {
    const { board_id, activityList } = req.body;
    const result = await ganttCharts.findOneAndUpdate(
      { _id: board_id },
      { $push: { gantt_charts: activityList } },
      { new: true }
    );
    res.status(200).json({ message: "간트차트 저장 완료"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "간트차트 저장 실패" });
  }
};