// src/pages/ChatWithLecture.jsx
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../api/BASE_URL";
import { selectActiveCourseDetailId } from "../../store/dataIDs/dataIDsSlice"; // ← عدّل الباث لو لازم

const API = `${BASE_URL}/api/Ai`;
const ACCENT = "#e76f2e";
const ACCENT_HOVER = "#cf5f1f";
const NAVY = "#1c2431";

export default function ChatWithLecture() {
  const navigate = useNavigate();
  const token = useSelector((s) => s?.auth?.token);

  // ✅ بدل useParams: ID من الريدكس
  const courseDetailId = useSelector(selectActiveCourseDetailId);

  const [chat, setChat] = useState([]);        // [{ role, content }]
  const [sourceId, setSourceId] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | preparing | ready | sending
  const [error, setError] = useState("");

  const listRef = useRef(null);
  const lastMsgRef = useRef(null);
  const lastUserMsgRef = useRef("");
  const retriedExpiredRef = useRef(false);

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
    instance.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        const st = err?.response?.status;
        if (st === 401 || st === 403) navigate("/login");
        return Promise.reject(err);
      }
    );
    return instance;
  }, [token, navigate]);

  const extractErr = (e) =>
    e?.response?.data
      ? typeof e.response.data === "string"
        ? e.response.data
        : JSON.stringify(e.response.data)
      : e?.message || "Unknown error";

  const scrollToBottom = () => {
    setTimeout(() => {
      lastMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  };

  const prepareAI = async () => api.post(`/Get-fileCoures/${courseDetailId}`, {});
  const newChat = async () => {
    const res = await api.get(`/New-chat/${courseDetailId}`);
    const data = res.data || {};
    setSourceId(data.sourceId ?? null);
    setChat(Array.isArray(data.messages) ? data.messages : []);
    return data;
  };
  const startChat = async (payload) => (await api.post(`/Start-chat`, payload)).data || {};

  useEffect(() => {
    (async () => {
      // 🛡️ لو مفيش ID من الريدكس
      if (!courseDetailId) {
        setError("لا يمكن فتح الدردشة مباشرة. ارجع لتفاصيل المادة واختر الحصة ثم ادخل هنا.");
        setStatus("idle");
        return;
      }
      try {
        if (!token) {
          setError("هذه الخدمة تتطلب تسجيل الدخول.");
          setStatus("idle");
          return;
        }
        setStatus("preparing");
        setError("");
        await prepareAI();
        await newChat();
        setStatus("ready");
        scrollToBottom();
      } catch (e) {
        setError(`تعذّر بدء الجلسة.\n${extractErr(e)}`);
        setStatus("idle");
      }
    })();
  }, [courseDetailId, token]);

  const handleSend = async () => {
    const text = (userInput || "").trim();
    if (!text || !sourceId || status === "sending") return;

    try {
      setStatus("sending");
      setError("");
      lastUserMsgRef.current = text;

      const optimistic = [...chat, { role: "user", content: text }];
      setChat(optimistic);
      setUserInput("");
      scrollToBottom();

      const payload = { sourceId, messages: chat, newMessage: text };
      const data = await startChat(payload);
      const msgs = Array.isArray(data.messages) ? data.messages : [];
      const lastServer = msgs[msgs.length - 1];

      setChat(lastServer ? [...optimistic, lastServer] : optimistic);
      setStatus("ready");
      retriedExpiredRef.current = false;
      scrollToBottom();
    } catch (e) {
      const msg = String(extractErr(e) || "");
      const looksExpired = /expired|session|انتهت/i.test(msg);
      if (looksExpired && !retriedExpiredRef.current) {
        try {
          retriedExpiredRef.current = true;
          setStatus("preparing");
          const fresh = await (async () => { await prepareAI(); return await newChat(); })();
          setStatus("ready");
          if (lastUserMsgRef.current) {
            setStatus("sending");
            const data2 = await startChat({
              sourceId: fresh?.sourceId ?? sourceId,
              messages: Array.isArray(fresh?.messages) ? fresh.messages : [],
              newMessage: lastUserMsgRef.current,
            });
            const msgs2 = Array.isArray(data2.messages) ? data2.messages : [];
            const lastServer2 = msgs2[msgs2.length - 1];
            setChat(
              lastServer2
                ? [...(fresh?.messages || []), { role: "user", content: lastUserMsgRef.current }, lastServer2]
                : [...(fresh?.messages || []), { role: "user", content: lastUserMsgRef.current }]
            );
            setStatus("ready");
            scrollToBottom();
            return;
          }
        } catch (re) {
          setError(`تعذّر إعادة التهيئة.\n${extractErr(re)}`);
          setStatus("ready");
        }
      } else {
        setError(`تعذّر الإرسال.\n${msg}`);
        setStatus("ready");
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white" dir="rtl">
      <div className="max-w-3xl mx-auto rounded-3xl border-4 shadow-xl p-6 flex flex-col h-[85vh]" style={{ borderColor: ACCENT }}>
        <h2 className="text-3xl font-bold mb-6 text-center rounded-2xl p-4"
            style={{ color: NAVY, background: "#fff4ef", border: `2px solid ${ACCENT}` }}>
          🤖💬 تحاور مع صديقك الذكي!
        </h2>

        {(!courseDetailId || error) && (
          <div className="whitespace-pre-wrap p-3 mb-3 rounded-2xl text-sm font-bold text-center"
               style={{ background: "#fff4ef", color: ACCENT, border: `2px solid ${ACCENT}` }}>
            {error || "لا يمكن فتح الدردشة مباشرة."}
            {!courseDetailId && (
              <div className="mt-2">
                <button
                  onClick={() => navigate("/student/course-details", { replace: true })}
                  className="rounded-lg bg-gray-800 text-white px-4 py-2"
                >
                  الرجوع لتفاصيل المادة
                </button>
              </div>
            )}
          </div>
        )}

        <div ref={listRef} className="flex-1 overflow-y-auto space-y-4 mb-6 p-4 rounded-3xl border"
             style={{ background: "#fafafa", borderColor: "#eee" }}>
          {chat.map((msg, idx) => {
            const isLast = idx === chat.length - 1;
            const mine = msg.role === "user";
            return (
              <div key={idx} className={`flex ${mine ? "justify-end" : "justify-start"}`} ref={isLast ? lastMsgRef : null}>
                <div className="p-4 rounded-3xl max-w-[75%] shadow-md border font-semibold text-[16px]"
                     style={{
                       background: mine ? "#eaf2ff" : "#fff4ef",
                       color: mine ? NAVY : ACCENT,
                       borderColor: mine ? "#cfe2ff" : "#ffd8c0"
                     }}>
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">{mine ? "👦" : "🤖"}</span>
                    <div className="flex-1 whitespace-pre-wrap break-words">{msg.content}</div>
                  </div>
                </div>
              </div>
            );
          })}
          {status === "sending" && (
            <div className="flex justify-start">
              <div className="p-3 rounded-2xl text-sm font-semibold"
                   style={{ background: "#fff4ef", color: ACCENT, border: `1px solid ${ACCENT}` }}>
                ⏳ يكتب الآن...
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 bg-white rounded-2xl p-3 border shadow-lg" style={{ borderColor: "#e5e7eb" }}>
          <input
            type="text"
            className="flex-1 rounded-2xl px-6 py-4 text-[16px] font-medium bg-white border focus:outline-none"
            placeholder={status === "preparing" ? "⏳ بنجهّز الجلسة..." : "اسأل أي سؤال عن الحصة..."}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={status === "preparing" || !token || !courseDetailId}
            style={{ borderColor: "#e5e7eb", color: NAVY }}
          />
          <button
            onClick={handleSend}
            className="text-white px-8 py-4 rounded-2xl font-bold text-[18px] shadow-md disabled:opacity-50"
            style={{ background: ACCENT, border: `2px solid ${ACCENT}` }}
            onMouseOver={(e) => (e.currentTarget.style.background = ACCENT_HOVER)}
            onMouseOut={(e) => (e.currentTarget.style.background = ACCENT)}
            disabled={status === "sending" || status === "preparing" || !userInput.trim() || !sourceId || !token || !courseDetailId}
            title={!token ? "يجب تسجيل الدخول لاستخدام الدردشة" : ""}
          >
            {status === "sending" ? "✉️ جاري..." : " أرسل"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 border"
               style={{ background: "#f6fbff", color: NAVY, borderColor: "#dbeafe" }}>
            <span className="text-2xl">💡</span>
            <span className="font-semibold text-sm">اسأل أي حاجة تخطر على بالك!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
