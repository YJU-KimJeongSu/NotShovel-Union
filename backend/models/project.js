const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
    name: { type: String, required: true },
    picture: String,
    description: String,
    create_date: { type: Date, default: Date.now },
    member_ids: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
    // board_ids: [
    //     {
    //         kind: { type: String, enum: ['GanttChart', 'MeetingMinute'] }, // enum으로 정해놓은 값 외에 다른 값이 들어오면 에러
    //         board: { type: Schema.Types.ObjectId, refPath: 'board_ids.kind' },
    //     },
    // ]
    meeting_minute_ids: [{ type: Schema.Types.ObjectId, ref: 'MeetingMinute' }],
    task_list_ids: [{ type: Schema.Types.ObjectId, ref: 'TaskList' }]
  });