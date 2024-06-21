import React, { useEffect, useState, useRef } from 'react';
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
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ message: message, clientId: event_guid })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Kiểm tra xem response có phải là stream không
    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Xử lý từng chunk dữ liệu
        console.log(decoder.decode(value));
      }
    } else {
      const text = await response.text();
      console.log(text);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function gen_message_id(isBot) {
  // Lấy timestamp hiện tại tính bằng giây
  const timestamp = Math.floor(Date.now() / 1000);
  // Xác định prefix dựa trên giá trị của isBot
  const prefix = isBot ? 'bot_msg_' : 'client_msg_';
  // Kết hợp prefix và timestamp để tạo id
  return `${prefix}${timestamp}`;
}

let event_guid = undefined
let responding_bot_msg_id = undefined
function Chat() {
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    console.log('useEffect')
    const eventSource = new EventSource(`http://localhost:3001/completion/events`);

    eventSource.onmessage = (event) => {
      // console.log(`onmessage ${event}`)
      // console.log(event.data)
      let guid = guid_message(event.data)
      if (guid) {
        event_guid = `${guid}`
        console.log(event_guid)
        return
      }
      let chunk = event.data
      append_chunk_to_message(responding_bot_msg_id, chunk)
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
    let client_msg_id = gen_message_id(false)
    let bot_response_id = gen_message_id(true)
    responding_bot_msg_id = bot_response_id

    setMessages([{
      message: "",
      isMine: false,
      id: bot_response_id
    },{
      message: message,
      isMine: true,
      id: client_msg_id
    }, ...messages]);
  };

  function append_chunk_to_message(id, chunk) {
    // Tìm index của message có id tương ứng
    const index = messagesRef.current.findIndex(msg => msg.id === id);
    
    // Nếu tìm thấy message
    if (index !== -1) {
      // Tạo một bản sao của array messages
      const updatedMessages = [...messagesRef.current];

      // Cập nhật message tại index đã tìm thấy
      updatedMessages[index] = {
        ...updatedMessages[index],
        message: updatedMessages[index].message + chunk
      };

      // Cập nhật state messages với array mới
      setMessages(updatedMessages);
    } else {
      console.warn(`Message with id ${id} not found`);
    }
  }

  // const addBotMessage = (message) => {
  //   setMessages([{
  //     message: message,
  //     isMine: false
  //   }, ...messages]);
  // };

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
