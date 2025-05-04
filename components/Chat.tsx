"use client"

import React, { useState, useEffect, useRef} from 'react'
// import Client from "voicevox-client";
import { GoogleGenAI, Content} from "@google/genai";


function Chat() {

  const [messages, setMessages] = useState<Content[]>([]);
  // const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [botTyping, setBotTyping] = useState(false);
  const VOICEVOX_API_KEY = 'N5y492108606g-5'

  // const client = new Client("http://0.0.0.0:50021");


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const sendMessage = () =>{
    var trim_input = input.trim();
    if (trim_input === "") return;
    const newMessage = {role: "user", parts: [{text: trim_input}]};
    const chatHistory = [...messages, newMessage];
    setMessages(chatHistory);
    setInput("");
    // console.log("req body:" , JSON.stringify(messages));
    getChatbotResponse(chatHistory).then((chatBotResponse) => {

      
      

      // console.log("BOT REPLY: ", chatBotResponse)
      // const chatBotResponseTrimmed = chatBotResponse?.trim();
      // const chatBotReply = {role: "model", parts: [{text: chatBotResponseTrimmed}]};
      // setMessages([...chatHistory, chatBotReply]);

      // // const chatHistory = [...messages, {role: "model", parts: [{text: chatBotResponseTrimmed}]}];
      // // setMessages(chatHistory);
    })};

  const clearMessage = () =>{
    setMessages([]);
  }

  const botReply = () => {
    setMessages([...messages, {role: "model", parts: [{text: "AUTO REPLIED"}]}]);
  }

  const botReplyVoice = async () => {
    // const audioquery = await client.createAudioQuery("こんにちは", 1);
    // const out = await audioquery.synthesis(1);
    // console.log(out);
  }

  const getChatbotResponse = async(updatedMessages: Content[]) => {
    try{
      setBotTyping(true);
      const textResponse = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(updatedMessages),
      });

      if(!textResponse.ok || !textResponse.body){
        throw new Error(`HTTP Error; status: ${textResponse.status}`)
      };
      const reader = textResponse.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let result = "";
      setMessages([...updatedMessages, {role: "model", parts: [{text: ""}]}])

      while(!done){
        const chunk = await reader.read();
        done = chunk.done;
        result += decoder.decode(chunk.value, {stream: !done});
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1 ? { ...msg, parts: [{text: result}] } : msg
          )
        );
      }
      console.log("Chatbot textResponse:" , result);

      const audioResponse = await fetch("/api/voicevox", {
        method: "POST",
        headers: {
          "Content-Type" : "text"
        },
        body: result,
      });



      // const audioResponse = await fetch(`https://deprecatedapis.tts.quest/v2/voicevox/audio/?text=${result}&key=${VOICEVOX_API_KEY}`, 
      //   {method: 'GET'});

      // console.log("Sending request to VoiceVox su-shiki server");
      // if(!audioResponse.ok){
      //   console.error("VoiceVox su-shiki server returned invalid textResponse:",  audioResponse);
      // };
      // const textResponseBlob = await audioResponse.blob();
      // const audioUrl = URL.createObjectURL(textResponseBlob); // Convert Blob to object URL
      // const audio = new Audio(audioUrl); // Create audio element
      // audio.play();


      return result;

    }catch(error){
      console.error("Error handling textResponse: ", error);
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
            onClick={botReplyVoice}
            className="bg-blue-500 text-white w-fit px-4 py-2 rounded-2xl text-center"
          >
            Bot reply
        </button>

      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages && 
        messages.length > 0 && 
        messages.map(({role, parts}, index) => { 
          return (
            <div key={index} className={"flex " + (role=='user' ? '': 'justify-end')}>
                {parts?.map(({text}, i) => (
                  <p key={i} className="bg-gray-900 p-3 rounded-lg max-w-md">
                    {text}
                  </p>
                ))}
                
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
