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
    const formattedData = gantt_data.data.map(item => ({
      id: item.id, // 고유한 ID
      activity_name: item.activity_name,
      activity_start_date: item.activity_start_date,
      activity_duration: item.activity_duration,
      activity_progress: item.activity_progress
    }));

    let result;

    if (board_id) {
      const existingGanttChart = await ganttCharts.findById(board_id);

      if (existingGanttChart) {
        const existingDataIds = existingGanttChart.gantt_data.data.map(item => item.id);

        formattedData.forEach(item => {
          const existingIndex = existingDataIds.indexOf(item.id);
          if (existingIndex !== -1) {
            // 이미 있는 작업인 경우 업데이트
            existingGanttChart.gantt_data.data[existingIndex] = item;
          } else {
            // 새로운 작업인 경우 추가
            existingGanttChart.gantt_data.data.push(item);
          }
        });

        // 삭제할 작업 찾기
        const deleteDataIds = existingDataIds.filter(id => !formattedData.some(item => item.id === id));
        existingGanttChart.gantt_data.data = existingGanttChart.gantt_data.data.filter(item => !deleteDataIds.includes(item.id));

        existingGanttChart.gantt_data.links = [
          ...existingGanttChart.gantt_data.links,
          ...gantt_data.links
        ];

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
          links: gantt_data.links
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
