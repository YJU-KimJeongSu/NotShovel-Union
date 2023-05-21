const ganttCharts = require("../models/gantt_charts");

exports.getGanttData = async (req, res) => {
  try {
    const { board_id } = req.params;
    const ganttData = await ganttCharts.findById({ _id: board_id });

    if (!ganttData) {
      return res.status(404).json({ message: "해당하는 게시판이 없습니다." });
    }

    res.status(200).json(ganttData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "간트차트 조회 실패" });
  }
};

exports.save = async (req, res) => {
  try {
    const { board_id, gantt_data } = req.body;

    const { data, links } = gantt_data; // tasks와 links를 추출

    const formattedData = data.map(task => ({
      id: task.id,
      activity_name: task.activity_name,
      activity_start_date: task.activity_start_date,
      activity_duration: task.activity_duration,
      activity_progress: task.activity_progress,
      parent: task.parent
    }));

    let result;

    if (board_id) {
      const existingGanttChart = await ganttCharts.findById(board_id);

      if (existingGanttChart) {
        existingGanttChart.gantt_data.data = formattedData;
        existingGanttChart.gantt_data.links = links;

        result = await existingGanttChart.save();
      } else {
        result = null;
      }
    } else {
      const newGanttChart = new ganttCharts({
        board_name: gantt_data.board_name,
        board_order: gantt_data.board_order,
        gantt_data: {
          data: formattedData,
          links: links
        }
      });

      result = await newGanttChart.save();
    }

    res.status(200).json({ message: "간트차트 저장 완료", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "간트차트 저장 실패" });
  }
};