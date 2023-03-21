const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// 기본 요청 url : mongodb://localhost:27017/admin
// localhost 쓰면 연결 안될 수도 있음 127.0.0.1 써요 여러분
const MONGO_URI = process.env.MONGO_URI;

// 몽구스 연결 - then catch임! 구버전 if else 주의해 여러분 ㅠ
const connect = () => {
  mongoose.connect(MONGO_URI)
  .then(() => console.log('mongodb 연결 성공'))
  .catch(e => console.error(e));
};

// 몽구스 커넥션에 이벤트 리스너를 달게 해준다. 에러 발생 시 에러 내용을 기록하고, 연결 종료 시 재연결을 시도한다.
mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});

mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
  connect(); // 연결 재시도
});

module.exports = connect;