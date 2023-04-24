const gantt_charts = require("../models/gantt_charts");

exports.save = async (req, res) => {
  try {
    const { project_id, board_name, activityList } = req.body;
    const activities = [];
    for (let i = 0; i < activityList.length; i++) {
      activities.push({
        project_id,
        board_name,
        // board_order,
        activity_name: activityList[i].activity_name,
        activity_start_date: activityList[i].activity_start_date,
        activity_duration: activityList[i].activity_duration,
        activity_progress: activityList[i].activity_progress,
        activity_manager: activityList[i].activity_manager,
      });
    }
    await gantt_charts.insertMany(activities);
    res.status(200).json({ message: "간트차트 저장 완료"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "간트차트 저장 실패" });
  }
};
