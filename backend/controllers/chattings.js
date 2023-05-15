const chat = require("../models/chattings");


exports.insertChat = async(req, res) => {
  const receiveChat = req.body;
  const boardId = req.query.boardId;

  try {
    await chat.findOneAndUpdate(
      { _id: boardId },
      { $push: {
        chattings: {
          context: receiveChat.context, member_id: receiveChat.member_id
        }
      } 
    });
    res.status(200).json({ message: "채팅 로그 저장성공" });
  } catch(e) {
    console.log(e);
    res.status(500).json({ message: "채팅 로그 저장실패" });
  }
};

exports.getChatList = async(req, res) => {
  const boardId = req.query.boardId;

  try {
    const chatLogs = await chat.findOne({ _id: boardId });
    console.log(chatLogs);
    res.status(200).json(chatLogs);
  } catch(e) {
    console.log(e);
    res.status(500).json({ message: "채팅 로그 불러오기 실패" });
  }
};

