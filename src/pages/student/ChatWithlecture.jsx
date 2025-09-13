// ChatWithLecture.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ChatWithLecture() {
  const { id } = useParams(); // CourseDetailId
  const [chat, setChat] = useState([]);
  const [sourceId, setSourceId] = useState(null);
  const [userInput, setUserInput] = useState("");

  // Init chat session
  useEffect(() => {
    axios
      .get(`https://edu-smart.runasp.net/api/Ai/New-chat/${id}`)
      .then((res) => {
        setSourceId(res.data.sourceId);
        setChat(res.data.messages || []);
      })
      .catch((err) => console.error("Chat init error:", err));
  }, [id]);

  const handleSend = () => {
    if (!userInput || !sourceId) return;
    const payload = {
      sourceId,
      messages: chat,
      newMessage: userInput,
    };
    axios
      .post("https://edu-smart.runasp.net/api/Ai/Start-chat", payload)
      .then((res) => {
        const updated = [
          ...chat,
          { role: "user", content: userInput },
          res.data.messages.at(-1),
        ];
        setChat(updated);
        setUserInput("");
      })
      .catch((err) => console.error("Chat send error:", err));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100" dir="rtl">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col h-[80vh]">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-800">تحاور مع الحصة 🤖</h2>
        <div className="flex-1 overflow-y-auto space-y-2 mb-4 px-2">
          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg max-w-[80%] ${
                msg.role === "user"
                  ? "bg-green-100 self-end text-right"
                  : "bg-gray-100 self-start text-left"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-1 border rounded-l-xl px-4 py-2 focus:outline-none"
            placeholder="اسأل عن محتوى الحصة..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-xl hover:bg-blue-600"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}
