// src/pages/student/WatchLecture.jsx
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../api/BASE_URL";

export default function WatchLecture() {
  // NOTE: route is /student/watch-lecture/:id  => CourseDetailId
  const { id } = useParams();
  const token = useSelector((s) => s.auth.token);
  const navigate = useNavigate();

  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // optional: chat bootstrap (لو محتاجاه هنا)
  const [chat, setChat] = useState([]);
  const [sourceId, setSourceId] = useState(null);

  // للحفاظ على objectURL وتنضيفه
  const objectUrlRef = useRef(null);

  // جلب الفيديو + تجهيز ملف الـ AI
  useEffect(() => {
    if (!token) return;

    let alive = true;
    async function load() {
      setLoading(true);
      setErrMsg("");

      try {
        // 1) تجهيز الملف لخدمات الـ AI (بالتوكن)
        await axios.post(
          `${BASE_URL}/api/Ai/Get-fileCoures/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // 2) جلب الفيديو
        const res = await axios.get(`${BASE_URL}/api/Course/Get-CourseVideo/${id}`, {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        });

        const contentType = res.headers["content-type"] || "";

        // لو سيرفر بيرجّع ملف mp4/webm/.. نشكّل URL محلي
        if (contentType.includes("video")) {
          const blob = new Blob([res.data], { type: contentType || "video/mp4" });
          const urlObject = URL.createObjectURL(blob);
          objectUrlRef.current = urlObject;
          if (alive) setVideoUrl(urlObject);
        } else {
          // fallback: لو السيرفر بيرجع رابط ضمني داخل blob (نادراً)
          // جرّب تحويله لنص والبحث عن URL
          try {
            const text = await res.data.text();
            const m = text.match(/https?:\/\/[^\s"']+/);
            if (m) {
              if (alive) setVideoUrl(m[0]);
            } else {
              throw new Error("Unexpected content");
            }
          } catch {
            throw new Error("Unexpected content type");
          }
        }
      } catch (e) {
        console.error(e);
        if (e?.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        if (alive) setErrMsg("تعذّر تحميل الفيديو. حاول مرة أخرى لاحقًا.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      // تنظيف أي objectURL
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [id, token, navigate]);

  // تهيئة جلسة الشات (اختياري)
  useEffect(() => {
    if (!token) return;
    let alive = true;
    axios
      .get(`${BASE_URL}/api/Ai/New-chat/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (!alive) return;
        setSourceId(res.data?.sourceId);
        setChat(res.data?.messages || []);
      })
      .catch((err) => console.error("Chat init error:", err));
    return () => {
      alive = false;
    };
  }, [id, token]);

  return (
    <main dir="rtl" className="bg-gray-50 min-h-screen py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">مشاهدة المحاضرة</h1>
           {/* <p className="text-sm text-gray-600 mt-1">رقم التفصيلة: <span className="font-semibold">#{id}</span></p>*/}
          </div>
          
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Video Card */}
          <section className="md:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 md:p-5">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-6 w-1/3 bg-gray-100 animate-pulse rounded" />
                  <div className="h-72 md:h-[430px] bg-gray-100 animate-pulse rounded-2xl" />
                </div>
              ) : errMsg ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 p-4">
                  {errMsg}
                </div>
              ) : videoUrl ? (
                /\.(mp4|webm|ogg)(\?|$)/i.test(videoUrl) ? (
                  <video
                    key={videoUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full rounded-2xl shadow"
                  >
                    <source src={videoUrl} type="video/mp4" />
                    متصفحك لا يدعم تشغيل الفيديو.
                  </video>
                ) : (
                  <div className="aspect-video">
                    <iframe
                      src={videoUrl}
                      title="lecture"
                      width="100%"
                      height="100%"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      className="rounded-2xl border-0"
                    />
                  </div>
                )
              ) : (
                <p className="text-gray-600">لا يوجد فيديو متاح.</p>
              )}

              {/* Link fallback */}
              {!loading && !errMsg && videoUrl && (
                <div className="mt-3 text-sm text-gray-600 break-all">
                  الرابط:&nbsp;
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline"
                  >
                    فتح في تبويب جديد
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Actions Panel */}
          <aside className="md:col-span-1">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 md:p-5 sticky top-6">
              <h2 className="text-lg font-extrabold text-gray-900 mb-3">إجراءات الحصة</h2>
              <div className="flex flex-col gap-3">
                <Link
                  to={`/student/summarize-page/${id}`}
                  className="rounded-xl bg-slate-900 hover:opacity-95 text-white font-semibold px-4 py-3 text-center"
                >
                  ملخص الحصة
                </Link>

                <Link
                  to={`/student/chat-page/${id}`}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-3 text-center"
                >
                  تحاور مع الحصة 💬
                </Link>

                <Link
                  to={`/student/translate-page/${id}`}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 text-center"
                >
                  ترجمة الحصة 🌐
                </Link>

                <Link
                  to={`/student/quiz-page/${id}`}
                  className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-3 text-center"
                >
                  اختبار الحصة 📝
                </Link>
              </div>

              {/* ملاحظة صغيرة أسفل الأزرار 
              <p className="text-xs text-gray-500 mt-4">
                بعض المزايا قد تتطلب تجهيز الملف أولًا. في حال واجهت مشكلة، أعد تحميل الصفحة.
              </p>*/}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
