// "use client"; 
// import { useState } from "react";

// export default function Chasdfasdfasdfat() {
//   const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
//     []
//   );
//   const [input, setInput] = useState("");

//   const sendMessage = () => {
//     if (input.trim() === "") return;
//     setMessages([...messages, { text: input, sender: "You" }]);
//     setInput("");
//   };

//   return (
//     <div className="flex flex-col w-full max-w-md mx-auto p-4 border rounded-lg shadow-lg">
//       <div className="flex-1 overflow-auto mb-4 p-2 border rounded-lg h-64 bg-gray-100">
//         {messages.map((msg, index) => (
//           <div key={index} className="mb-2 text-black">
//             <strong>{msg.sender}:</strong> {msg.text}
//           </div>
//         ))}
//       </div>
//       <div className="flex">
//         <input
//           type="text"
//           className="flex-1 border p-2 rounded-l-lg"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
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
      <p>Main</p>
      <Chat/>
    </>
  );
}