const mongoose = require("mongoose");
const { Schema } = mongoose;

const projects = new Schema({
  name: { type: String, required: true },
  image: String,
  description: String,
  create_date: { type: Date, default: Date.now },
  member_ids: [{ type: Schema.Types.ObjectId, ref: "members", required: true }],
  admin_id: { type: Schema.Types.ObjectId, ref: "members", required: true },
  manager_ids: [{ type: Schema.Types.ObjectId, ref: "members" }],
  // board_ids: [
  //     {
  //         kind: { type: String, enum: ['gantt_charts', 'meeting_minutes'] }, // enum으로 정해놓은 값 외에 다른 값이 들어오면 에러
  //         board: { type: Schema.Types.ObjectId, refPath: 'board_ids.kind' },
  //     },
  // ]
  // 이게 사용하기 더 쉬움
  meeting_minutes_ids: [{ type: Schema.Types.ObjectId, ref: "meeting_minutes" }],
  gantt_charts_ids: [{ type: Schema.Types.ObjectId, ref: "gantt_charts" }],
  chattings_ids: [{ type: Schema.Types.ObjectId, ref: "chattings" }]
});

module.exports = mongoose.model("projects", projects);
