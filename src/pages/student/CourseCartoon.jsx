// src/pages/student/CourseCartoon.jsx
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../api/BASE_URL";

export default function CourseCartoon() {
  // /student/course-cartoon/:id => :id = CourseDetailId
  const { id: courseDetailId } = useParams();
  const location = useLocation();
  const q = new URLSearchParams(location.search);
  const courseId = q.get("courseId");
  const lecNo = Number(q.get("lecNo") || 0);

  const token = useSelector((s) => s.auth.token);
  const navigate = useNavigate();

  const [videoUrl, setVideoUrl] = useState(null);
  const [ytEmbedUrl, setYtEmbedUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [debugTried, setDebugTried] = useState([]);

  const objectUrlRef = useRef(null);
  const videoRef = useRef(null);

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

        try {
          await axios.post(
            `${BASE_URL}/api/Ai/Get-fileCoures/${courseDetailId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch {}

        const { data } = await axios.get(
          `${BASE_URL}/api/Course/course-lectures-and-cartoon-videos/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const cartoons = Array.isArray(data?.cartoonVideos) ? data.cartoonVideos : [];
        let chosen =
          cartoons.find((x) => Number(x?.lecture) === lecNo) ||
          cartoons[0];

        if (!chosen) throw new Error("لا توجد فيديوهات كرتونية متاحة لهذا الكورس.");

        const fileName = chosen.cartoonVideoName || chosen.videoName || chosen.fileName;
        if (!fileName) throw new Error("لا يوجد videoName في بيانات الفيديو.");

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

        throw new Error("تعذّر تحميل/تشغيل الفيديو من الخادم.");
      } catch (e) {
      
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
  }, [token, courseId, lecNo, courseDetailId, navigate]);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <main dir="rtl" className="min-h-screen py-6 bg-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* الفيديو */}
          <section className="md:col-span-2">
            <div className="relative rounded-3xl bg-white shadow-xl p-6 select-none overflow-hidden" style={{ border: "4px solid #e76f2e" }}>
              <div className="absolute left-0 right-0 top-0" style={{ height: 8, backgroundColor: "#e76f2e" }} />
              <div
                className="pointer-events-none absolute z-20 text-sm md:text-base font-bold select-none"
                style={{ top: `${14 + (tick % 4) * 9}%`, left: `${18 + (tick % 6) * 7}%`, color: "#1c2431", opacity: 0.15 }}
              >
                EduSmart • {new Date().toLocaleString()}
              </div>

              <div className="relative z-10">
                {loading ? (
                  <div className="h-72 md:h-[430px] animate-pulse rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(90deg,#fff4ef,#fafafa,#fff4ef)" }}>
                    <div className="text-center">
                      <div className="text-6xl mb-4 animate-spin" style={{ color: "#e76f2e" }}>🎪</div>
                      <p className="font-bold text-xl" style={{ color: "#1c2431" }}>جارٍ التحضير...</p>
                    </div>
                  </div>
                ) : errMsg ? (
                  <>
                    <div className="rounded-2xl p-6 text-center" style={{ border: "3px solid #e76f2e", background: "#fff4ef", color: "#1c2431" }}>
                      <div className="text-4xl mb-3">😔</div>
                      <p className="font-bold text-lg">حدث خطأ</p>
                      <p className="mt-2">{errMsg}</p>
                    </div>
                    {debugTried.length > 0 && (
                      <div className="mt-4 bg-white rounded-xl p-4 border" style={{ borderColor: "#eee", color: "#1c2431" }}>
                        <div className="font-bold mb-2">🔍 تقرير المحاولات:</div>
                        <ul className="space-y-1 text-sm">
                          {debugTried.map((t, i) => (
                            <li key={i} className="break-all bg-[#fafafa] rounded px-2 py-1">
                              {t.status} — {t.url}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : ytEmbedUrl ? (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg" style={{ border: "4px solid #e76f2e" }}>
                    <iframe key={ytEmbedUrl} src={ytEmbedUrl} title="YouTube player" className="w-full h-full" allow="autoplay; encrypted-media" sandbox="allow-scripts allow-same-origin" referrerPolicy="strict-origin-when-cross-origin" />
                  </div>
                ) : videoUrl ? (
                  <div className="rounded-2xl overflow-hidden shadow-lg" style={{ border: "4px solid #e76f2e" }}>
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
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4" style={{ color: "#e76f2e" }}>🎥</div>
                    <p className="font-semibold text-xl" style={{ color: "#1c2431" }}>لا يوجد فيديو متاح حالياً</p>
                    <p className="mt-2" style={{ color: "#4b5563" }}>جرّب لاحقًا.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* الإجراءات */}
          <aside className="md:col-span-1">
            <div className="rounded-3xl bg-white shadow-xl p-6 sticky top-6 overflow-hidden" style={{ border: "4px solid #e76f2e" }}>
              <h2 className="text-2xl font-black mb-6 text-center" style={{ color: "#1c2431" }}>🎯 أنشطة التعلم</h2>

              <div className="flex flex-col gap-4">
                <Link to={`/student/summarize-page/${courseDetailId}`} className="group relative rounded-2xl px-6 py-4 text-center font-bold text-white shadow-lg transition-all" style={{ background: "#e76f2e" }}>
                  <span className="relative z-10">📚 ملخص مبسط للدرس</span>
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(255,255,255,0.12)" }} />
                </Link>

                <Link to={`/student/chat-page/${courseDetailId}`} className="group relative rounded-2xl px-6 py-4 text-center font-bold text-white shadow-lg transition-all" style={{ background: "#1c2431" }}>
                  <span className="relative z-10">💬 دردش مع المدرس الذكي</span>
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(255,255,255,0.10)" }} />
                </Link>

                <Link to={`/student/translate-page/${courseDetailId}`} className="group relative rounded-2xl px-6 py-4 text-center font-bold text-white shadow-lg transition-all" style={{ background: "#e76f2e" }}>
                  <span className="relative z-10">🌍 ترجم كلمات جديدة</span>
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(255,255,255,0.12)" }} />
                </Link>

                <Link
                  to={`/student/watch-lecture/${courseDetailId}?courseId=${courseId}&lecNo=${lecNo || 1}`}
                  className="group relative rounded-2xl px-6 py-4 text-center font-bold text-white shadow-lg transition-all"
                  style={{ background: "#1c2431" }}
                >
                  <span className="relative z-10">🎞️ اذهب إلى المحاضرات</span>
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(255,255,255,0.10)" }} />
                </Link>
              </div>

              <div className="mt-6 text-center rounded-2xl p-4" style={{ background: "#fff4ef", border: "2px solid #f7c9ab", color: "#1c2431" }}>
                <div className="text-2xl mb-2">🌟</div>
                <p className="font-bold text-sm">استمتع بالتعلّم المرئي! 🎉</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
