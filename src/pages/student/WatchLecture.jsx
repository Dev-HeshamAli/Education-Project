// src/pages/student/WatchLecture.jsx
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../api/BASE_URL";

export default function WatchLecture() {
  // /student/watch-lecture/:id => :id = CourseDetailId
  const { id: courseDetailId } = useParams();
  const location = useLocation();
  const q = new URLSearchParams(location.search);
  const courseId = q.get("courseId");
  const lecNo = Number(q.get("lecNo") || 0);
  const kind = (q.get("kind") || "auto").toLowerCase(); // "auto" | "lecture" | "cartoon"

  const token = useSelector((s) => s.auth.token);
  const navigate = useNavigate();

  const [videoUrl, setVideoUrl] = useState(null);       // object URL أو direct mp4
  const [ytEmbedUrl, setYtEmbedUrl] = useState(null);   // رابط يوتيوب embeddable
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [debugTried, setDebugTried] = useState([]);

  // لزر "مشاهدة الفيديو الكرتوني"
  const [hasCartoon, setHasCartoon] = useState(false);
  const [firstCartoonNo, setFirstCartoonNo] = useState(null);

  const objectUrlRef = useRef(null);
  const videoRef = useRef(null);

  // منع جزء من التحميل/النسخ (لا يمنع 100%)
  useEffect(() => {
    const blockCtx = (e) => e.preventDefault();
    const blockKeys = (e) => {
      const k = e.key.toLowerCase();
      const combo = e.ctrlKey || e.metaKey;
      const devtools = e.shiftKey && (k === "i" || k === "j" || k === "c");
      const bad = combo && (k === "s" || k === "p" || k === "u");
      if (bad || devtools) e.preventDefault();
    };
    document.addEventListener("contextmenu", blockCtx);
    window.addEventListener("keydown", blockKeys);
    return () => {
      document.removeEventListener("contextmenu", blockCtx);
      window.removeEventListener("keydown", blockKeys);
    };
  }, []);

  const toObjectUrl = (blob, contentType = "video/mp4") => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(new Blob([blob], { type: contentType }));
    objectUrlRef.current = url;
    return url;
  };

  const fetchBlobWithAuth = async (url) => {
    const res = await axios.get(url, {
      responseType: "blob",
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: () => true,
    });
    return res;
  };

  const isHttpUrl = (s) => /^https?:\/\//i.test(String(s || ""));
  const parseYouTubeId = (raw) => {
    try {
      const u = new URL(raw);
      const host = u.hostname.replace(/^www\./, "");
      if (host === "youtu.be") return u.pathname.split("/").filter(Boolean)[0] || null;
      if (host.endsWith("youtube.com")) {
        if (u.searchParams.get("v")) return u.searchParams.get("v");
        const parts = u.pathname.split("/").filter(Boolean);
        if (parts[0] === "embed" || parts[0] === "shorts") return parts[1] || null;
      }
      return null;
    } catch { return null; }
  };

  useEffect(() => {
    if (!token) return;
    if (!courseId) { setErrMsg("المعرف courseId غير موجود في الرابط."); return; }
    if (!courseDetailId) { setErrMsg("المعرف الخاص بالمحاضرة غير صحيح."); return; }

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErrMsg("");
        setDebugTried([]);
        setVideoUrl(null);
        setYtEmbedUrl(null);
        setHasCartoon(false);
        setFirstCartoonNo(null);

        // اختياري
        try {
          await axios.post(
            `${BASE_URL}/api/Ai/Get-fileCoures/${courseDetailId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch {}

        // 1) هات بيانات الفيديوهات
        const { data } = await axios.get(
          `${BASE_URL}/api/Course/course-lectures-and-cartoon-videos/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const lectures = Array.isArray(data?.lectures) ? data.lectures : [];
        const cartoons = Array.isArray(data?.cartoonVideos) ? data.cartoonVideos : [];

        setHasCartoon(cartoons.length > 0);
        setFirstCartoonNo(cartoons[0]?.lecture ?? null);

        // 2) اختاري الفيديو حسب kind
        let chosen = null;
        if (kind === "cartoon") {
          chosen = cartoons.find((x) => Number(x?.lecture) === lecNo) || cartoons[0];
        } else if (kind === "lecture") {
          chosen = lectures.find((x) => Number(x?.lecture) === lecNo) || lectures[0];
        } else {
          // auto: الأفضلية للمحاضرات العادية ثم الكرتون
          chosen =
            lectures.find((x) => Number(x?.lecture) === lecNo) ||
            cartoons.find((x) => Number(x?.lecture) === lecNo) ||
            lectures[0] || cartoons[0];
        }

        if (!chosen) throw new Error("لا توجد محاضرات/فيديوهات في هذا الكورس.");

        const fileName =
          chosen.videoName || chosen.cartoonVideoName || chosen.fileName;
        if (!fileName) throw new Error("لا يوجد videoName في بيانات المحاضرة.");

        // 3) لو رابط http(s)
        if (isHttpUrl(fileName)) {
          const ytId = parseYouTubeId(fileName);
          if (ytId) {
            const embed = `https://www.youtube.com/embed/${ytId}?controls=0&disablekb=1&modestbranding=1&rel=0&fs=0&iv_load_policy=3&playsinline=1`;
            if (alive) setYtEmbedUrl(embed);
            return;
          }
          if (alive) setVideoUrl(fileName);
          return;
        }

        // 4) اسم ملف داخلي → جرّبي مسارات GetStaticFiles
        const enc = encodeURIComponent(fileName);
        const candidates = [
          `${BASE_URL}/GetStaticFiles/videos/${enc}`,
          `${BASE_URL}/GetStaticFiles/files/${enc}`,
          `${BASE_URL}/GetStaticFiles/${enc}`,
          `${BASE_URL}/api/GetStaticFiles/videos/${enc}`,
          `${BASE_URL}/api/GetStaticFiles/files/${enc}`,
        ];

        for (const url of candidates) {
          const res = await fetchBlobWithAuth(url);
          setDebugTried((prev) => [...prev, { url, status: res.status }]);
          if (res.status === 200) {
            const type = res.headers?.["content-type"] || "video/mp4";
            const objUrl = toObjectUrl(res.data, type);
            if (alive) setVideoUrl(objUrl);
            return;
          } else if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
        }

        throw new Error("تعذّر تحميل/تشغيل الفيديو من الخادم (ملف غير موجود أو مسار غير صحيح).");
      } catch (e) {
        console.error("WatchLecture load error:", e);
        if (alive) setErrMsg(e?.message || "تعذّر تحميل الفيديو.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      alive = false;
    };
  }, [token, courseId, lecNo, courseDetailId, kind, navigate]);

  // ووتـرمارك بسيطة
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <main dir="rtl" className="bg-gray-50 min-h-screen py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">مشاهدة المحاضرة</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2">
            <div className="relative rounded-2xl border border-gray-200 bg-white shadow-sm p-4 md:p-5 select-none">
              {/* ووتـرمارك */}
              <div
                className="pointer-events-none absolute z-20 text-white/70 text-xs md:text-sm font-semibold select-none"
                style={{
                  top: `${10 + (tick % 5) * 8}%`,
                  left: `${15 + (tick % 7) * 6}%`,
                  textShadow: "0 1px 2px rgba(0,0,0,.6)",
                  userSelect: "none",
                }}
              >
                EduSmart • {new Date().toLocaleString()}
              </div>

              {loading ? (
                <div className="h-72 md:h-[430px] bg-gray-100 animate-pulse rounded-2xl" />
              ) : errMsg ? (
                <>
                  <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 p-4">{errMsg}</div>
                  {debugTried.length > 0 && (
                    <div className="mt-4 text-xs text-gray-600">
                      <div className="font-bold mb-1">تقرير المحاولات:</div>
                      <ul className="space-y-1">
                        {debugTried.map((t, i) => (
                          <li key={i} className="break-all">{t.status} — {t.url}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : ytEmbedUrl ? (
                <div className="aspect-video w-full rounded-2xl overflow-hidden">
                  <iframe
                    key={ytEmbedUrl}
                    src={ytEmbedUrl}
                    title="YouTube player"
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    sandbox="allow-scripts allow-same-origin"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              ) : videoUrl ? (
                <video
                  key={videoUrl}
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full rounded-2xl shadow"
                  controlsList="nodownload noplaybackrate noremoteplayback"
                  disablePictureInPicture
                  // @ts-ignore
                  disableRemotePlayback
                  onContextMenu={(e) => e.preventDefault()}
                />
              ) : (
                <p className="text-gray-600">لا يوجد فيديو متاح.</p>
              )}
            </div>
          </section>

          <aside className="md:col-span-1">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 md:p-5 sticky top-6">
              <h2 className="text-lg font-extrabold text-gray-900 mb-3">إجراءات الحصة</h2>
              <div className="flex flex-col gap-3">
                <Link to={`/student/summarize-page/${courseDetailId}`} className="rounded-xl bg-slate-900 hover:opacity-95 text-white font-semibold px-4 py-3 text-center">ملخص الحصة</Link>
                <Link to={`/student/chat-page/${courseDetailId}`} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-3 text-center">تحاور مع الحصة 💬</Link>
                <Link to={`/student/translate-page/${courseDetailId}`} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 text-center">ترجمة الحصة 🌐</Link>
                <Link to={`/student/quiz-page/${courseDetailId}`} className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-3 text-center">اختبار الحصة 📝</Link>

                {/* ✅ الزر الجديد: مشاهدة الفيديو الكرتوني */}
                
                  <Link
                    to={`/student/watch-lecture/${courseDetailId}?courseId=${courseId}&lecNo=${lecNo || firstCartoonNo || 1}&kind=cartoon`}
                    className="rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-3 text-center"
                  >
                    مشاهدة الفيديو الكرتوني 🎬
                  </Link>
              
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
