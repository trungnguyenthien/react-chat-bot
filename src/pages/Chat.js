import React, { useEffect, useState } from 'react';
import ChatInput from '../components/common/ChatInput';
import '../assets/styles/Chat.css'

// Nếu message có format <guid>{{ID}} (ví dụ: <guid>8261f47e377143649d5f1dc212d4e5e3)
// Hãy trả về chuỗi 8261f47e377143649d5f1dc212d4e5e3
// Nếu không phải thì trả về null
function guid_message(msg) {
  // Sử dụng regular expression để tìm chuỗi có format <guid>{{ID}}
  const match = msg.match(/<guid>([0-9a-fA-F]{32})/);
  return match ? match[1] : null;
}

// Thực hiện phương thức POST đến `http://localhost:3001/completion/stream`
// raw body của phương thức POST là nội dung `message`
async function stream_message(message) {
  try {
    const response = await fetch('http://localhost:3001/completion/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, clientId: event_guid }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      console.log(decoder.decode(value));
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

let event_guid = undefined

function Chat() {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    console.log('useEffect')
    const eventSource = new EventSource(`http://localhost:3001/completion/events`);

    eventSource.onmessage = (event) => {
      // console.log(`onmessage ${event}`)
      // console.log(event.data)
      let guid = guid_message(event.data)
      if(guid) {
        event_guid = `${guid}`
        console.log(event_guid)
        return
      }
      let chunk = event.data
    };

    eventSource.onerror = () => {
      console.error('EventSource failed.');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);


  const addUserMessage = (message) => {
    stream_message(message)
    console.log(message)
    
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
