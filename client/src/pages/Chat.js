import React, { useState } from 'react';
import ChatInput from '../components/common/ChatInput';
import '../assets/styles/Chat.css'
function Chat() {
  const [messages, setMessages] = useState([]);

  const addUserMessage = (message) => {
    setMessages([{
      message: message,
      isMine: true
    }, ...messages]);
  };

  const addBotMessage = (message) => {
    setMessages([{
      message: message,
      isMine: false
    }, ...messages]);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => {
          let className = msg.isMine ? 'message-mine' : 'message-bot';
          return (<div key={index} className={className}>{msg.message}</div>)
        })}
      </div>
      <ChatInput addMessage={addUserMessage} />
    </div>
  );
}

export default Chat;
