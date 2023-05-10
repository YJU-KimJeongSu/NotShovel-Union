const mongoose = require('mongoose');
const { Schema } = mongoose;

const gantt_charts = new Schema({
    // 게시판 공통 내용
    project_id: { type: Schema.Types.ObjectId, ref: 'projects', required: true },
    board_name: { type: String, required: true },
    board_order: { type: Number, required: true}, // 중복이 안돼야 정렬할때 편하게 작업 가능

    // 간트차트 내용
    activity_name: { type: String},
    activity_start_date: { type: Date, default: Date.now },
    activity_duration: Number, // 추후 작업에 따라 Date로 변경 가능성 열어두기
    activity_progress: { type: Number, default: 0, min: 0, max: 100 },
    activity_manager: String // ObjectId로 담을 경우 find작업을 한번 더 해야하고, 이름만 필요하니 이름만 담기
});

module.exports = mongoose.model('gantt_charts', gantt_charts);