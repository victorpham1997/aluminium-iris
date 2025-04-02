"use client"

import React, { useState } from 'react'
import { message, type Message } from './Message';
// import { Send } from 'lucide-react';


function Chat() {

  const [messages, setMessages] = useState<Message[]>(
    []
  );
  const [input, setInput] = useState("");

  const sendMessage = () =>{
    var trim_input = input.trim();
    if (trim_input === "") return;
    setMessages([...messages, { content: trim_input, sender: "You" }]);
    setInput("");
  }

  return (
    <div className="fixed px-50 pb-10 bottom-0 left-0 w-full flex items-center ">
      <div className="bg-white w-full px-5 py-3 rounded-2xl flex items-center gap-4">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-2 border border-gray-300 rounded-l-2xl text-black"
        />
        <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-2xl"
          >
            Send
          </button>
        </div>
    </div>
  )
}

export default Chat
