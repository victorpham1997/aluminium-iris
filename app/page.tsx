// "use client"
// import { useState, useEffect, useRef } from "react";

// export default function ChatPage() {
//   const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
//   const [input, setInput] = useState("");
//   const chatEndRef = useRef<HTMLDivElement | null>(null);

//   const sendMessage = () => {
//     if (input.trim() === "") return;
//     setMessages([...messages, { text: input, sender: "user" }]);
//     setInput("");
//   };

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="flex flex-col h-screen p-4 bg-gray-100">
//       {/* Chat Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded-lg max-w-xs ${msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"}`}
//           >
//             {msg.text}
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input Box */}
//       <div className="p-4 bg-white border-t flex">
//         <input
//           type="text"
//           className="flex-1 p-2 border rounded-lg focus:outline-none"
//           placeholder="Type a message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button
//           className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
//           onClick={sendMessage}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }



import Chat from "@/components/Chat";

export default function Main() {
  return (
    <>
      <Chat/>
    </>
  );
}