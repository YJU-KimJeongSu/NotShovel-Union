const mongoose = require("mongoose");
const { Schema } = mongoose;

const gantt_charts = new Schema({
  // 게시판 공통 내용
  project_id: { type: Schema.Types.ObjectId, ref: "projects", required: true },
  board_name: { type: String, required: true },
  board_order: { type: Number, required: true }, // 중복이 안돼야 정렬할때 편하게 작업 가능

  // 간트차트 내용
  gantt_data : {
    data: [
      {
        id: { type: Number, required: true, unique: true }, // 고유한 ID
        activity_name: { type: String },
        activity_start_date: { type: Date, default: Date.now },
        activity_duration: Number,
        activity_progress: { type: Number, default: 0, min: 0, max: 100 },
      },
    ],
    links: [
      {
        source: { type: Number },
        target: { type: Number },
        type: { type: String },
      },
    ],
  },
});

module.exports = mongoose.model("gantt_charts", gantt_charts);
