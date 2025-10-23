import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/BASE_URL";
import {
  selectLectureContext,
  setLectureContext,
  setActiveCourseDetailId,
} from "../../store/dataIDs/dataIDsSlice";

/* --------- utils --------- */
const extractDriveId = (url) => {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("drive.google.com")) return null;
    return u.pathname.match(/\/file\/d\/([^/]+)/)?.[1] || u.searchParams.get("id") || null;
  } catch {}
  return null;
};
const toDrivePreview = (url) => {
  const id = extractDriveId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : null;
};
const pick = (o, keys) => {
  if (!o) return "";
  for (const k of keys) {
    const v = o[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
  }
  return "";
};
const prefer = (a, b) => (String(a || "").trim() || String(b || "").trim() || "");

/* ------------------------- */

export default function WatchLecture() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((s) => s.auth.token);
  const ctx = useSelector(selectLectureContext) || {};
  const { courseDetailId, courseId, lecNo } = ctx;

  // ✅ افتراضي: الأصلي
  const [kind, setKind] = useState(ctx.kind || "lecture");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [player, setPlayer] = useState({ drivePreview: "", file: "" });

  const [links, setLinks] = useState({
    lectureVideo: "",
    lectureCartoonVideo: "",
    summaryFile: "",
    cartonVideoSummaryFile: "",
  });

  // (اختياري) خزّن نوع العرض الحالي في Redux
  useEffect(() => {
    if (!courseDetailId || !courseId) return;
    dispatch(setLectureContext({ ...ctx, kind }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  // أنشطة جانبية — Redux بلا URL
  const goSummary   = () => { dispatch(setActiveCourseDetailId(courseDetailId)); navigate("/student/summarize-page"); };
  const goChat      = () => { dispatch(setActiveCourseDetailId(courseDetailId)); navigate("/student/chat-page"); };
  const goTranslate = () => { dispatch(setActiveCourseDetailId(courseDetailId)); navigate("/student/translate-page"); };
  const goQuiz      = () => { dispatch(setActiveCourseDetailId(courseDetailId)); navigate("/student/quiz-page"); };

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!token || !courseDetailId || !courseId) {
        setErr(". من فضلك ارجع واختر الدرس مرة أخرى.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setErr("");

      const auth = { headers: { Authorization: `Bearer ${token}` } };
      let initData = null;
      let listData = null;
      try {
        const r1 = await axios.post(`${BASE_URL}/api/Ai/Get-fileCoures/${courseDetailId}`, {}, auth);
        initData = r1?.data;
      } catch {}
      try {
        const r2 = await axios.get(`${BASE_URL}/api/Course/course-lectures/${courseId}`, auth);
        listData = r2?.data;
      } catch {}

      const extractDetailLinks = (payload, wanted) => {
        const fromObj = (obj) => ({
          lectureVideo: pick(obj, ["lectureVideo", "LectureVideo"]),
          lectureCartoonVideo: pick(obj, ["lectureCartoonVideo", "lectureCartonVideo"]),
          summaryFile: pick(obj, ["summaryFile"]),
          cartonVideoSummaryFile: pick(obj, ["cartonVideoSummaryFile"]),
        });
        if (!payload) return {};
        if (Array.isArray(payload)) {
          const byNo =
            payload.find((x) => Number(x?.lecture ?? x?.lec ?? x?.no) === Number(wanted)) ||
            payload[0] || {};
          return fromObj(byNo);
        }
        return fromObj(payload);
      };

      const L1 = extractDetailLinks(initData, lecNo);
      const L2 = extractDetailLinks(listData, lecNo);
      const merged = {
        lectureVideo: prefer(L1.lectureVideo, L2.lectureVideo),
        lectureCartoonVideo: prefer(L1.lectureCartoonVideo, L2.lectureCartoonVideo),
        summaryFile: prefer(L1.summaryFile, L2.summaryFile),
        cartonVideoSummaryFile: prefer(L1.cartonVideoSummaryFile, L2.cartonVideoSummaryFile),
      };
      if (alive) setLinks(merged);

      // اختيار الفيديو حسب kind
      const allLectures = Array.isArray(listData) ? listData : [];
      const chooseFrom = (arr, key) => {
        const byNo = arr.find((x) => Number(x?.lecture ?? x?.lec ?? x?.no) === Number(lecNo));
        const v = pick(byNo || {}, [key, "fileName", "videoName"]);
        return v || pick(arr[0] || {}, [key, "fileName", "videoName"]);
      };

      let playUrl =
        (kind === "cartoon"
          ? (chooseFrom(allLectures, "lectureCartoonVideo") || merged.lectureCartoonVideo)
          : (chooseFrom(allLectures, "lectureVideo") || merged.lectureVideo)) || "";

      // fallback لو النوع الحالي مفيهوش رابط
      if (!playUrl) {
        playUrl =
          (chooseFrom(allLectures, "lectureVideo") || merged.lectureVideo ||
           chooseFrom(allLectures, "lectureCartoonVideo") || merged.lectureCartoonVideo) || "";
      }

      if (!playUrl) {
        setErr("لا يوجد فيديو متاح لهذا الدرس.");
        setLoading(false);
        return;
      }

      const preview = toDrivePreview(playUrl);
      if (preview) {
        if (alive) setPlayer({ drivePreview: preview, file: "" });
      } else {
        if (alive) setPlayer({ drivePreview: "", file: playUrl });
      }

      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, [token, courseDetailId, courseId, lecNo, kind]);

  const cartoonAvailable = useMemo(() => Boolean(links.lectureCartoonVideo), [links.lectureCartoonVideo]);
  const normalAvailable  = useMemo(() => Boolean(links.lectureVideo),        [links.lectureVideo]);

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="rounded-xl bg-white shadow p-6 text-slate-700">جارٍ التحميل…</div>
      </main>
    );
  }
  if (err) {
    return (
      <main dir="rtl" className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="rounded-xl bg-white shadow p-6 text-red-600">
          {err}
          <div className="mt-3 text-center">
            <button
              onClick={() => navigate("/student/course-details", { replace: true })}
              className="rounded-lg bg-gray-800 text-white px-4 py-2"
            >
              الرجوع لتفاصيل المادة
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 py-8">
      <section className="mx-auto max-w-6xl px-4">
        <div className="mb-5">
          <h1 className="text-2xl font-extrabold text-slate-900">مشاهدة الدرس</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Player */}
          <div className="md:col-span-2">
            <div className="rounded-2xl bg-white border shadow overflow-hidden">
              {player.drivePreview ? (
                <div className="aspect-video">
                  <iframe
                    src={player.drivePreview}
                    title="Drive Preview"
                    className="w-full h-full"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <video
                  src={player.file}
                  className="w-full"
                  controls
                  playsInline
                  preload="metadata"
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  // @ts-ignore
                  disableRemotePlayback
                  onContextMenu={(e) => e.preventDefault()}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-1 space-y-4">
            {/* أنشطة التعلم */}
            <div className="rounded-2xl bg-white border shadow p-4">
              <h3 className="font-bold text-slate-900 mb-3">أنشطة التعلم</h3>
              <div className="grid gap-2">
                <button onClick={goSummary}   className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 text-center">📚 ملخص الدرس</button>
                <button onClick={goChat}      className="rounded-lg bg-slate-900 hover:bg-black text-white font-bold px-4 py-2 text-center">💬 دردشة ذكية</button>
                <button onClick={goTranslate} className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 text-center">🌍 ترجمة</button>
                <button onClick={goQuiz}      className="rounded-lg bg-slate-900 hover:bg-black text-white font-bold px-4 py-2 text-center">🏆 اختبار</button>
              </div>
            </div>

            {/* روابط الدرس (أزرار تبديل داخل نفس الـ player) */}
            {(normalAvailable || cartoonAvailable || links.summaryFile || links.cartonVideoSummaryFile) && (
              <div className="rounded-2xl bg-white border shadow p-4">
                <h3 className="font-bold text-slate-900 mb-3">روابط الدرس</h3>
                <div className="grid gap-2">
                  {/* ✅ الأصلي داخل نفس المشغّل */}
                  <button
                    disabled={!normalAvailable}
                    onClick={() => setKind("lecture")}
                    className={`rounded-lg px-3 py-2 font-semibold ${
                      kind === "lecture"
                        ? "bg-slate-900 text-white"
                        : "bg-white border text-slate-800"
                    } ${!normalAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    ▶️ الفيديو الأصلي
                  </button>

                  {/* ✅ الكرتوني داخل نفس المشغّل */}
                  <button
                    disabled={!cartoonAvailable}
                    onClick={() => setKind("cartoon")}
                    className={`rounded-lg px-3 py-2 font-semibold ${
                      kind === "cartoon"
                        ? "bg-orange-500 text-white"
                        : "bg-white border text-slate-800"
                    } ${!cartoonAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    🎬 النسخة الكرتونية
                  </button>

                  {links.summaryFile && (
                    <a
                      href={links.summaryFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 font-bold px-4 py-2 text-center"
                    >
                      📄 ملخص الدرس (PDF)
                    </a>
                  )}
                  {links.cartonVideoSummaryFile && (
                    <a
                      href={links.cartonVideoSummaryFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border-2 border-amber-500 text-amber-700 hover:bg-amber-50 font-bold px-4 py-2 text-center"
                    >
                      📄 ملخص النسخة الكرتونية
                    </a>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
