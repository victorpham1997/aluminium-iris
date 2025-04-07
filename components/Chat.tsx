"use client"

import React, { useState, useEffect, useRef} from 'react'
// import { message, type Message } from './Message';
import { resolve } from 'path';


// export type Message = {
//   sender: string
//   content?: string
// }


function Chat() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [bitTyping, setBotTyping] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const sendMessage = () =>{
    var trim_input = input.trim();
    if (trim_input === "") return;
    const newMessage = {role: "user", parts: [{ text: trim_input}]};
    setMessages([...messages, newMessage]);
    setInput("");
    getChatbotResponse(messages).then((chatBotResponse) => {
      const chatBotResponseTrimmed = chatBotResponse.trim();
      setMessages([...messages, { content: chatBotResponseTrimmed, sender: 'user' }]);
    })
  }

  const clearMessage = () =>{
    setMessages([]);
  }

  const botReply = () => {
    setMessages([...messages, { content: 'auto replied', sender: 'bot' }]);
  }

  const getChatbotResponse = async(updatedChatHistory) => {
    try{
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(updatedChatHistory),
      });

      if(!response.ok) throw new Error(`HTTP Error; status: ${response.status}`);
      setBotTyping(true);
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let result = "";

      while(!done){
        const chunk = await reader.read();
        done = chunk.done;
        result += decoder.decode(chunk.value, {stream: !done});
      }
      console.log("Chatbot response:" , result);
      return result;

    }catch(error){
      console.error("Error handling response: ", error);
    }finally{
      setBotTyping(false);
    }
  };

  return (
    // <div className="my-6 mx-60 w-auto flex flex-col gap-5">
    <div className="flex flex-col h-screen p-4">
      <div className="flex-none justify-center text-center">
        HELLO
      </div>
      <div className='flex-row gap-4 flex'>
        <button
            onClick={clearMessage}
            className="bg-red-500 text-white w-fit px-4 py-2 rounded-2xl text-center"
          >
            Clear
        </button>
        <button
            onClick={botReply}
            className="bg-blue-500 text-white w-fit px-4 py-2 rounded-2xl text-center"
          >
            Bot reply
        </button>

      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages && 
        messages.length > 0 && 
        messages.map(({sender, content}, index) => {
          return (
            <div key={index} className={"flex " + (sender=='user' ? '': 'justify-end')}>
              <p className={"bg-gray-900 p-3 rounded-lg max-w-md text-right" }>
                {sender}:{content}
              </p>
            </div>
          )
        })}
        <div ref={chatEndRef} />
      </div>
      <div className=" bg-white inset-x-0 px-5 py-3 rounded-2xl flex items-center gap-4 my-10 mx-50 ">
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
