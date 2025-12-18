import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/BASE_URL";
import {
  selectLectureContext,
  setLectureContext,
  setActiveCourseDetailId,
} from "../../store/dataIDs/dataIDsSlice";
import { CircularProgress, Typography } from "@mui/material";

/* --------- utils --------- */
const extractDriveId = (url) => {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("drive.google.com")) return null;
    return (
      u.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ||
      u.searchParams.get("id") ||
      null
    );
  } catch (e) {
    console.error(e);
  }
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
    if (v !== undefined && v !== null && String(v).trim() !== "")
      return String(v);
  }
  return "";
};
const prefer = (a, b) => String(a || "").trim() || String(b || "").trim() || "";

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

  function Button({
    children,
    icon,
    color = "bg-gray-400",
    textSmall = false,
    onClick,
    className = "",
    to,
    loading = false,
  }) {
    const baseClasses = `${color} text-white font-extrabold rounded-full shadow-md hover:scale-[1.03] hover:shadow-xl transition duration-300 
    w-full 
    h-11 sm:h-12 lg:h-14 xl:h-[56px] 
    xl:w-[300px] 
    px-3 lg:px-4 
    flex items-center justify-center gap-2 text-center 
    ${
      textSmall
        ? "text-[12px] sm:text-[13px] lg:text-[14px] xl:text-[15px] leading-tight"
        : "text-[13px] sm:text-[14px] lg:text-[15px] xl:text-[16px]"
    } 
    ${className} ${loading ? "opacity-80 cursor-wait" : ""}`;

    const content = (
      <>
        {icon && <i className={`${icon} text-base sm:text-lg lg:text-xl`}></i>}
        <span className="leading-tight text-center">{children}</span>
        {loading && <i className="bx bx-loader-alt animate-spin text-xl" />}
      </>
    );

    if (to) {
      return (
        <Link
          to={to}
          className={baseClasses}
          aria-label={typeof children === "string" ? children : "زر تنقّل"}
        >
          {content}
        </Link>
      );
    }
    return (
      <button onClick={onClick} className={baseClasses} disabled={loading}>
        {content}
      </button>
    );
  }

  // (اختياري) خزّن نوع العرض الحالي في Redux
  useEffect(() => {
    if (!courseDetailId || !courseId) return;
    dispatch(setLectureContext({ ...ctx, kind }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  // أنشطة جانبية — Redux بلا URL
  const goSummary = () => {
    dispatch(setActiveCourseDetailId(courseDetailId));
    navigate("/student/summarize-page");
  };
  const goChat = () => {
    dispatch(setActiveCourseDetailId(courseDetailId));
    navigate("/student/chat-page");
  };
  const goTranslate = () => {
    dispatch(setActiveCourseDetailId(courseDetailId));
    navigate("/student/translate-page");
  };
  const goQuiz = () => {
    dispatch(setActiveCourseDetailId(courseDetailId));
    navigate("/student/quiz-page");
  };

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
        const r1 = await axios.post(
          `${BASE_URL}/api/Ai/Get-fileCoures/${courseDetailId}`,
          {},
          auth
        );
        initData = r1?.data;
      } catch (e) {
        console.error(e);
      }
      try {
        const r2 = await axios.get(
          `${BASE_URL}/api/Course/course-lectures/${courseId}`,
          auth
        );
        listData = r2?.data;
      } catch (e) {
        console.error(e);
      }

      const extractDetailLinks = (payload, wanted) => {
        const fromObj = (obj) => ({
          lectureVideo: pick(obj, ["lectureVideo", "LectureVideo"]),
          lectureCartoonVideo: pick(obj, [
            "lectureCartoonVideo",
            "lectureCartonVideo",
          ]),
          summaryFile: pick(obj, ["summaryFile"]),
          cartonVideoSummaryFile: pick(obj, ["cartonVideoSummaryFile"]),
        });
        if (!payload) return {};
        if (Array.isArray(payload)) {
          const byNo =
            payload.find(
              (x) => Number(x?.lecture ?? x?.lec ?? x?.no) === Number(wanted)
            ) ||
            payload[0] ||
            {};
          return fromObj(byNo);
        }
        return fromObj(payload);
      };

      const L1 = extractDetailLinks(initData, lecNo);
      const L2 = extractDetailLinks(listData, lecNo);
      const merged = {
        lectureVideo: prefer(L1.lectureVideo, L2.lectureVideo),
        lectureCartoonVideo: prefer(
          L1.lectureCartoonVideo,
          L2.lectureCartoonVideo
        ),
        summaryFile: prefer(L1.summaryFile, L2.summaryFile),
        cartonVideoSummaryFile: prefer(
          L1.cartonVideoSummaryFile,
          L2.cartonVideoSummaryFile
        ),
      };
      if (alive) setLinks(merged);

      // اختيار الفيديو حسب kind
      const allLectures = Array.isArray(listData) ? listData : [];
      const chooseFrom = (arr, key) => {
        const byNo = arr.find(
          (x) => Number(x?.lecture ?? x?.lec ?? x?.no) === Number(lecNo)
        );
        const v = pick(byNo || {}, [key, "fileName", "videoName"]);
        return v || pick(arr[0] || {}, [key, "fileName", "videoName"]);
      };

      let playUrl =
        (kind === "cartoon"
          ? chooseFrom(allLectures, "lectureCartoonVideo") ||
            merged.lectureCartoonVideo
          : chooseFrom(allLectures, "lectureVideo") || merged.lectureVideo) ||
        "";

      // fallback لو النوع الحالي مفيهوش رابط
      if (!playUrl) {
        playUrl =
          chooseFrom(allLectures, "lectureVideo") ||
          merged.lectureVideo ||
          chooseFrom(allLectures, "lectureCartoonVideo") ||
          merged.lectureCartoonVideo ||
          "";
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
    return () => {
      alive = false;
    };
  }, [token, courseDetailId, courseId, lecNo, kind]);

  const cartoonAvailable = useMemo(
    () => Boolean(links.lectureCartoonVideo),
    [links.lectureCartoonVideo]
  );
  const normalAvailable = useMemo(
    () => Boolean(links.lectureVideo),
    [links.lectureVideo]
  );

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen flex items-center justify-center flex-col bg-slate-50 gap-4"
      >
        <CircularProgress color="inherit" size={50} />
        <Typography variant="h4" color="initial">
          جارٍ التحميل
        </Typography>
      </main>
    );
  }
  // if (loading) {
  //   return (
  //     <main
  //       dir="rtl"
  //       className="min-h-screen flex items-center justify-center bg-slate-50"
  //     >
  //       {/* <div className="rounded-xl bg-white shadow p-6 text-slate-700">
  //         جارٍ التحميل…
  //       </div> */}
  //     </main>
  //   );
  // }
  if (err) {
    return (
      <main
        dir="rtl"
        className="min-h-screen flex items-center justify-center bg-slate-50"
      >
        <div className="rounded-xl bg-white shadow p-6 text-red-600">
          {err}
          <div className="mt-3 text-center">
            <button
              onClick={() =>
                navigate("/student/course-details", { replace: true })
              }
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
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-10 px-6"
    >
      <section className="mx-auto max-w-[1500px]">
        {/* ===== العنوان الرئيسي ===== */}
        <div className="mb-10 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <i className="bx bx-video text-[11rem] text-blue-600"></i>
          </div>
          <h1 className="relative text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 mb-4">
            مشاهدة الدرس
          </h1>
          <p className="text-slate-600 text-sm font-medium">
            استمتع بتجربة تعليمية متكاملة
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <div className="h-1.5 w-20 bg-gradient-to-r from-blue-600 to-blue-600 rounded-full"></div>
            <div className="h-1.5 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
          </div>
        </div>

        {/* ===== الشبكة الرئيسية ===== */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* ✅ العمود الأيمن: أنشطة التعلم */}
          <aside className="lg:col-span-3 order-1">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-blue-300 rounded-3xl opacity-75 group-hover:opacity-100 blur-sm transition duration-300"></div>
              <div className="relative rounded-3xl bg-white p-6 shadow-md">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-2xl">
                    <i className="bx bx-brain text-3xl text-purple-600"></i>
                  </div>
                </div>
                <h3 className="font-black text-xl text-slate-900 mb-6 text-center">
                  أنشطة التعلم
                </h3>

                <div className="grid gap-3 ">
                  <Button
                    color="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:shadow-lg hover:shadow-amber-500/50 transform transition-all duration-300"
                    icon="bx bx-book"
                    onClick={goSummary}
                  >
                    <span className="font-bold">ملخص الدرس</span>
                  </Button>

                  <Button
                    color="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/50 transform transition-all duration-300"
                    icon="bx bx-chat"
                    onClick={goChat}
                  >
                    <span className="font-bold">دردشة ذكية</span>
                  </Button>

                  <Button
                    color="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/50 transform transition-all duration-300"
                    icon="bx bx-globe"
                    onClick={goTranslate}
                  >
                    <span className="font-bold">ترجمة</span>
                  </Button>

                  <Button
                    color="bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 hover:shadow-lg hover:shadow-rose-500/50 transform transition-all duration-300"
                    icon="bx bx-trophy"
                    onClick={goQuiz}
                  >
                    <span className="font-bold">اختبار</span>
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* ✅ العمود الأوسط: الفيديو */}
          <div className="lg:col-span-6 order-2">
            <div className="relative group flex items-center justify-center bg-white rounded-3xl overflow-hidden">
              {/* الخلفية المتحركة */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded-3xl opacity-80 group-hover:opacity-100 blur-md transition duration-500"></div>

              {/* الحاوية الداخلية للفيديو */}
              <div
                className="relative rounded-3xl bg-white shadow-2xl border-4 border-white w-full"
                style={{
                  height: "auto",
                  maxHeight: "600px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onContextMenu={(e) => e.preventDefault()}
              >
                {player.drivePreview ? (
                  player.drivePreview.includes("youtube.com") ? (
                    // ✅ يوتيوب
                    <iframe
                      src={player.drivePreview.replace("watch?v=", "embed/")}
                      title="YouTube video player"
                      className="rounded-3xl aspect-video w-full"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "500px",
                      }}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                    ></iframe>
                  ) : player.drivePreview.includes("drive.google.com") ? (
                    // ✅ Google Drive
                    <iframe
                      src={player.drivePreview.replace("/view", "/preview")}
                      title="Google Drive video"
                      className="rounded-3xl aspect-video w-full"
                      style={{
                        border: "none",
                        height: "auto",
                        maxHeight: "500px",
                      }}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    // ✅ فيديو محلي
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      controlsList="nodownload noremoteplayback"
                      disablePictureInPicture
                      // @ts-ignore
                      disableRemotePlayback
                      src={player.file}
                      className="w-full aspect-video max-h-[500px] rounded-3xl object-contain"
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <p className="text-white text-center text-lg py-10">
                    Select a lecture to load video
                  </p>
                )}
              </div>
            </div>

            {/* <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded-3xl opacity-80 group-hover:opacity-100 blur-md transition duration-500"></div>
              <div className="relative rounded-3xl bg-white shadow-2xl overflow-hidden border-4 border-white">
                {player.drivePreview ? (
                  <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800">
                    <iframe
                      src={player.drivePreview}
                      title="Drive Preview"
                      className="w-full h-[440px] rounded-3xl"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <video
                    src={player.file}
                    className="w-full h-[500px] rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800"
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
            </div> */}

            {/* ✅ شريط المعلومات أسفل الفيديو */}
            <div className="mt-6 bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
              <div className="flex items-center justify-center gap-6 text-sm text-slate-600 flex-wrap">
                <div className="flex items-center gap-2">
                  <i className="bx bx-play-circle text-purple-600 text-xl"></i>
                  <span className="font-medium">جودة عالية</span>
                </div>
                <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <i className="bx bx-lock text-pink-600 text-xl"></i>
                  <span className="font-medium">محمي</span>
                </div>
                <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <i className="bx bx-star text-amber-500 text-xl"></i>
                  <span className="font-medium">محتوى مميز</span>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ العمود الأيسر: روابط الدرس */}
          <aside className="lg:col-span-3 order-3">
            {(normalAvailable ||
              cartoonAvailable ||
              links.summaryFile ||
              links.cartonVideoSummaryFile) && (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-3xl opacity-75 group-hover:opacity-100 blur-sm transition duration-300"></div>
                <div className="relative rounded-3xl bg-white p-6 shadow-md">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-3 rounded-2xl">
                      <i className="bx bx-link text-3xl text-indigo-600"></i>
                    </div>
                  </div>
                  <h3 className="font-black text-xl text-slate-900 mb-6 text-center">
                    روابط الدرس
                  </h3>

                  <div className="grid gap-3">
                    <Button
                      color="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-500 hover:shadow-lg hover:shadow-emerald-500/50 transform transition-all duration-300"
                      icon="bx bx-play-circle"
                      onClick={() => setKind("lecture")}
                      className={
                        !normalAvailable
                          ? "opacity-50 cursor-not-allowed grayscale"
                          : ""
                      }
                      loading={!normalAvailable}
                    >
                      <span className="font-bold">فيديو الدرس</span>
                    </Button>

                    <Button
                      color="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-indigo-500/50 transform transition-all duration-300"
                      icon="bx bx-movie-play"
                      onClick={() => setKind("cartoon")}
                      className={
                        !cartoonAvailable
                          ? "opacity-50 cursor-not-allowed grayscale"
                          : ""
                      }
                      loading={!cartoonAvailable}
                    >
                      <span className="font-bold">النسخة الكرتونية</span>
                    </Button>

                    {links.summaryFile && (
                      <a
                        href={links.summaryFile}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          color="bg-gradient-to-r from-lime-500 via-green-500 to-lime-500 hover:shadow-lg hover:shadow-lime-500/50 transform transition-all duration-300"
                          icon="bx bx-file"
                        >
                          <span className="font-bold">ملخص الدرس (PDF)</span>
                        </Button>
                      </a>
                    )}

                    {links.cartonVideoSummaryFile && (
                      <a
                        href={links.cartonVideoSummaryFile}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          color="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:shadow-lg hover:shadow-amber-500/50 transform transition-all duration-300"
                          icon="bx bx-file"
                        >
                          <span className="font-bold">
                            ملخص النسخة الكرتونية
                          </span>
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* ===== الشريط السفلي ===== */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-8 py-4 shadow-lg border border-slate-200">
            <i className="bx bx-info-circle text-purple-600 text-xl"></i>
            <p className="text-sm text-slate-600 font-medium">
              استمتع بتجربة تعليمية فريدة ومتطورة
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
// import axios from "axios";
// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { BASE_URL } from "../../api/BASE_URL";
// import {
//   selectLectureContext,
//   setLectureContext,
//   setActiveCourseDetailId,
// } from "../../store/dataIDs/dataIDsSlice";

// /* --------- utils --------- */
// const extractDriveId = (url) => {
//   try {
//     const u = new URL(url);
//     if (!u.hostname.includes("drive.google.com")) return null;
//     return u.pathname.match(/\/file\/d\/([^/]+)/)?.[1] || u.searchParams.get("id") || null;
//   } catch {}
//   return null;
// };
// const toDrivePreview = (url) => {
//   const id = extractDriveId(url);
//   return id ? `https://drive.google.com/file/d/${id}/preview` : null;
// };
// const pick = (o, keys) => {
//   if (!o) return "";
//   for (const k of keys) {
//     const v = o[k];
//     if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
//   }
//   return "";
// };
// const prefer = (a, b) => (String(a || "").trim() || String(b || "").trim() || "");

// /* ------------------------- */

// export default function WatchLecture() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const token = useSelector((s) => s.auth.token);
//   const ctx = useSelector(selectLectureContext) || {};
//   const { courseDetailId, courseId, lecNo } = ctx;

//   // ✅ افتراضي: الأصلي
//   const [kind, setKind] = useState(ctx.kind || "lecture");

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const [player, setPlayer] = useState({ drivePreview: "", file: "" });

//   const [links, setLinks] = useState({
//     lectureVideo: "",
//     lectureCartoonVideo: "",
//     summaryFile: "",
//     cartonVideoSummaryFile: "",
//   });

//   // (اختياري) خزّن نوع العرض الحالي في Redux
//   useEffect(() => {
//     if (!courseDetailId || !courseId) return;
//     dispatch(setLectureContext({ ...ctx, kind }));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [kind]);

//   // أنشطة جانبية — Redux بلا URL
//   const goSummary   = () => { dispatch(setActiveCourseDetailId(courseDetailId)); navigate("/student/summarize-page"); };
//   const goChat      = () => { dispatch(setActiveCourseDetailId(courseDetailId)); navigate("/student/chat-page"); };
//   const goTranslate = () => { dispatch(setActiveCourseDetailId(courseDetailId)); navigate("/student/translate-page"); };
//   const goQuiz      = () => { dispatch(setActiveCourseDetailId(courseDetailId)); navigate("/student/quiz-page"); };

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       if (!token || !courseDetailId || !courseId) {
//         setErr(". من فضلك ارجع واختر الدرس مرة أخرى.");
//         setLoading(false);
//         return;
//       }
//       setLoading(true);
//       setErr("");

//       const auth = { headers: { Authorization: `Bearer ${token}` } };
//       let initData = null;
//       let listData = null;
//       try {
//         const r1 = await axios.post(`${BASE_URL}/api/Ai/Get-fileCoures/${courseDetailId}`, {}, auth);
//         initData = r1?.data;
//       } catch {}
//       try {
//         const r2 = await axios.get(`${BASE_URL}/api/Course/course-lectures/${courseId}`, auth);
//         listData = r2?.data;
//       } catch {}

//       const extractDetailLinks = (payload, wanted) => {
//         const fromObj = (obj) => ({
//           lectureVideo: pick(obj, ["lectureVideo", "LectureVideo"]),
//           lectureCartoonVideo: pick(obj, ["lectureCartoonVideo", "lectureCartonVideo"]),
//           summaryFile: pick(obj, ["summaryFile"]),
//           cartonVideoSummaryFile: pick(obj, ["cartonVideoSummaryFile"]),
//         });
//         if (!payload) return {};
//         if (Array.isArray(payload)) {
//           const byNo =
//             payload.find((x) => Number(x?.lecture ?? x?.lec ?? x?.no) === Number(wanted)) ||
//             payload[0] || {};
//           return fromObj(byNo);
//         }
//         return fromObj(payload);
//       };

//       const L1 = extractDetailLinks(initData, lecNo);
//       const L2 = extractDetailLinks(listData, lecNo);
//       const merged = {
//         lectureVideo: prefer(L1.lectureVideo, L2.lectureVideo),
//         lectureCartoonVideo: prefer(L1.lectureCartoonVideo, L2.lectureCartoonVideo),
//         summaryFile: prefer(L1.summaryFile, L2.summaryFile),
//         cartonVideoSummaryFile: prefer(L1.cartonVideoSummaryFile, L2.cartonVideoSummaryFile),
//       };
//       if (alive) setLinks(merged);

//       // اختيار الفيديو حسب kind
//       const allLectures = Array.isArray(listData) ? listData : [];
//       const chooseFrom = (arr, key) => {
//         const byNo = arr.find((x) => Number(x?.lecture ?? x?.lec ?? x?.no) === Number(lecNo));
//         const v = pick(byNo || {}, [key, "fileName", "videoName"]);
//         return v || pick(arr[0] || {}, [key, "fileName", "videoName"]);
//       };

//       let playUrl =
//         (kind === "cartoon"
//           ? (chooseFrom(allLectures, "lectureCartoonVideo") || merged.lectureCartoonVideo)
//           : (chooseFrom(allLectures, "lectureVideo") || merged.lectureVideo)) || "";

//       // fallback لو النوع الحالي مفيهوش رابط
//       if (!playUrl) {
//         playUrl =
//           (chooseFrom(allLectures, "lectureVideo") || merged.lectureVideo ||
//            chooseFrom(allLectures, "lectureCartoonVideo") || merged.lectureCartoonVideo) || "";
//       }

//       if (!playUrl) {
//         setErr("لا يوجد فيديو متاح لهذا الدرس.");
//         setLoading(false);
//         return;
//       }

//       const preview = toDrivePreview(playUrl);
//       if (preview) {
//         if (alive) setPlayer({ drivePreview: preview, file: "" });
//       } else {
//         if (alive) setPlayer({ drivePreview: "", file: playUrl });
//       }

//       if (alive) setLoading(false);
//     })();
//     return () => { alive = false; };
//   }, [token, courseDetailId, courseId, lecNo, kind]);

//   const cartoonAvailable = useMemo(() => Boolean(links.lectureCartoonVideo), [links.lectureCartoonVideo]);
//   const normalAvailable  = useMemo(() => Boolean(links.lectureVideo),        [links.lectureVideo]);

//   if (loading) {
//     return (
//       <main dir="rtl" className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="rounded-xl bg-white shadow p-6 text-slate-700">جارٍ التحميل…</div>
//       </main>
//     );
//   }
//   if (err) {
//     return (
//       <main dir="rtl" className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="rounded-xl bg-white shadow p-6 text-red-600">
//           {err}
//           <div className="mt-3 text-center">
//             <button
//               onClick={() => navigate("/student/course-details", { replace: true })}
//               className="rounded-lg bg-gray-800 text-white px-4 py-2"
//             >
//               الرجوع لتفاصيل المادة
//             </button>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main dir="rtl" className="min-h-screen bg-slate-50 py-8">
//       <section className="mx-auto max-w-6xl px-4">
//         <div className="mb-5">
//           <h1 className="text-2xl font-extrabold text-slate-900">مشاهدة الدرس</h1>
//         </div>

//         <div className="grid md:grid-cols-3 gap-6">
//           {/* Player */}
//           <div className="md:col-span-2">
//             <div className="rounded-2xl bg-white border shadow overflow-hidden">
//               {player.drivePreview ? (
//                 <div className="aspect-video">
//                   <iframe
//                     src={player.drivePreview}
//                     title="Drive Preview"
//                     className="w-full h-full"
//                     allow="autoplay; fullscreen"
//                     allowFullScreen
//                     referrerPolicy="no-referrer"
//                   />
//                 </div>
//               ) : (
//                 <video
//                   src={player.file}
//                   className="w-full"
//                   controls
//                   playsInline
//                   preload="metadata"
//                   controlsList="nodownload noremoteplayback"
//                   disablePictureInPicture
//                   // @ts-ignore
//                   disableRemotePlayback
//                   onContextMenu={(e) => e.preventDefault()}
//                 />
//               )}
//             </div>
//           </div>

//           {/* Sidebar */}
//           <aside className="md:col-span-1 space-y-4">
//             {/* أنشطة التعلم */}
//             <div className="rounded-2xl bg-white border shadow p-4">
//               <h3 className="font-bold text-slate-900 mb-3">أنشطة التعلم</h3>
//               <div className="grid gap-2">
//                 <button onClick={goSummary}   className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 text-center">📚 ملخص الدرس</button>
//                 <button onClick={goChat}      className="rounded-lg bg-slate-900 hover:bg-black text-white font-bold px-4 py-2 text-center">💬 دردشة ذكية</button>
//                 <button onClick={goTranslate} className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 text-center">🌍 ترجمة</button>
//                 <button onClick={goQuiz}      className="rounded-lg bg-slate-900 hover:bg-black text-white font-bold px-4 py-2 text-center">🏆 اختبار</button>
//               </div>
//             </div>

//             {/* روابط الدرس (أزرار تبديل داخل نفس الـ player) */}
//             {(normalAvailable || cartoonAvailable || links.summaryFile || links.cartonVideoSummaryFile) && (
//               <div className="rounded-2xl bg-white border shadow p-4">
//                 <h3 className="font-bold text-slate-900 mb-3">روابط الدرس</h3>
//                 <div className="grid gap-2">
//                   {/* ✅ الأصلي داخل نفس المشغّل */}
//                   <button
//                     disabled={!normalAvailable}
//                     onClick={() => setKind("lecture")}
//                     className={`rounded-lg px-3 py-2 font-semibold ${
//                       kind === "lecture"
//                         ? "bg-slate-900 text-white"
//                         : "bg-white border text-slate-800"
//                     } ${!normalAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
//                   >
//                     ▶️ الفيديو الأصلي
//                   </button>

//                   {/* ✅ الكرتوني داخل نفس المشغّل */}
//                   <button
//                     disabled={!cartoonAvailable}
//                     onClick={() => setKind("cartoon")}
//                     className={`rounded-lg px-3 py-2 font-semibold ${
//                       kind === "cartoon"
//                         ? "bg-orange-500 text-white"
//                         : "bg-white border text-slate-800"
//                     } ${!cartoonAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
//                   >
//                     🎬 النسخة الكرتونية
//                   </button>

//                   {links.summaryFile && (
//                     <a
//                       href={links.summaryFile}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="rounded-lg border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 font-bold px-4 py-2 text-center"
//                     >
//                       📄 ملخص الدرس (PDF)
//                     </a>
//                   )}
//                   {links.cartonVideoSummaryFile && (
//                     <a
//                       href={links.cartonVideoSummaryFile}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="rounded-lg border-2 border-amber-500 text-amber-700 hover:bg-amber-50 font-bold px-4 py-2 text-center"
//                     >
//                       📄 ملخص النسخة الكرتونية
//                     </a>
//                   )}
//                 </div>
//               </div>
//             )}
//           </aside>
//         </div>
//       </section>
//     </main>
//   );
// }
