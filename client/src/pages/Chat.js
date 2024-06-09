import React, { useState } from 'react';
import ChatInput from '../components/common/ChatInput';
import '../assets/styles/Chat.css'
function Chat() {
  const [messages, setMessages] = useState([]);

  const addMessage = (message) => {
    setMessages([...messages, message]);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>
      <ChatInput addMessage={addMessage} />
    </div>
  );
}

export default Chat;
