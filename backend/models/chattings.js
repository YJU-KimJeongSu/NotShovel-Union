const mongoose = require('mongoose');
const { Schema } = mongoose;

const chattings = new Schema({
    context: { type: String, required: true },
    type: { type: String, enum: ['normal', 'reply', 'mention', 'file'], required: true },
    date: { type: Date, default: Date.now },
    member_id: { type: Schema.Types.ObjectId, ref: 'members', required: true },
    attached_file: {
        file_name: { type: String, required: true },
        file_extension: String, // 확장자 없는 파일 올렸을 때 에러 방지용으로 required설정 x
    },
});

module.exports = mongoose.model('chattings', chattings);