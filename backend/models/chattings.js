const mongoose = require('mongoose');
const { Schema } = mongoose;

const chattings = new Schema({
    // 게시판 공통 내용
    project_id: { type: Schema.Types.ObjectId, ref: 'projects', required: true },
    board_name: { type: String, required: true },
    board_order: { type: Number, required: true, unique: true }, // 중복이 안돼야 정렬할때 편하게 작업 가능

    // 채팅 내용
    context: { type: String },
    type: { type: String, enum: ['normal', 'reply', 'mention', 'file'] },
    date: { type: Date, default: Date.now },
    member_id: { type: Schema.Types.ObjectId, ref: 'members' },
    attached_file: {
        file_name: { type: String },
        file_extension: String, // 확장자 없는 파일 올렸을 때 에러 방지용으로 required설정 x
    },
});

module.exports = mongoose.model('chattings', chattings);