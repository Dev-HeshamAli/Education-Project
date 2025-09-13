// src/pages/student/StudentCurrentCourses.jsx
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../api/BASE_URL";

export default function StudentCurrentCourses() {
  const { studentId: idFromRoute } = useParams();
  const token = useSelector((s) => s.auth.token); // نقرأه فقط، مش هنحطه في deps
  const { id } = useSelector((s) => s.auth);
  const studentId = idFromRoute ?? id;

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  
  useEffect(() => {
    let alive = true;

    async function load() {
      // نفترض إن الراوت محمي ومش هيوصل هنا إلا والتوكن جاهز
      if (!studentId || !token) return;

      try {
        setLoading(true);
        setErr("");

        const { data } = await axios.get(
          `${BASE_URL}/api/Student/student-courses-now/${studentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (alive) setData(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        if (e?.response?.status === 401) {
          // توجيه هادئ بدون reload
          navigate("/login", { replace: true });
        } else {
          setErr(e?.response?.data?.title || e?.message || "حدث خطأ غير متوقع");
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
    // ⚠️ مهم: ما نحطّش token في dependencies علشان ما يعملش "reload إحساسي" عند refresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, navigate]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter((c) => (c.name || "").toLowerCase().includes(s));
  }, [q, data]);

  return (
    <section dir="rtl" className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-10 pb-20">
        {/* العنوان والبحث */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">المواد الحالية</h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="ابحث باسم الكورس…"
              className="w-full md:w-80 rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-orange-500"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <span className="hidden md:inline-flex items-center rounded-xl bg-white px-3 py-2 text-sm text-gray-600 border border-gray-200">
              {loading ? "..." : `${filtered.length} كورس`}
            </span>
          </div>
        </div>

        {/* التحميل */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-gray-200 p-5">
                <div className="h-6 w-2/3 bg-gray-100 animate-pulse rounded mb-4" />
                <div className="flex gap-2 mb-4">
                  <div className="h-5 w-16 bg-gray-100 animate-pulse rounded" />
                  <div className="h-5 w-20 bg-gray-100 animate-pulse rounded" />
                </div>
                <div className="h-4 w-1/2 bg-gray-100 animate-pulse rounded" />
              </div>
            ))}
          </div>
        )}

        {/* الخطأ */}
        {!loading && err && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 p-4">
            {err}
          </div>
        )}

        {/* فارغ */}
        {!loading && !err && filtered.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600">
            لا توجد كورسات مسجّلة حاليًا.
          </div>
        )}

        {/* القائمة */}
        {!loading && !err && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <p>{c.id}</p>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {c.name}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    {c.semsterName && (
                      <p>
                        <span className="font-semibold text-gray-700">الفصل الدراسي:</span>{" "}
                        {c.semsterName}
                      </p>
                    )}
                    {c.studyLevel && (
                      <p>
                        <span className="font-semibold text-gray-700">المستوى:</span>{" "}
                        {c.studyLevel}
                      </p>
                    )}
                    {c.teacherName && (
                      <p>
                        <span className="font-semibold text-gray-700">المعلم:</span>{" "}
                        {c.teacherName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    to={`/student/course-details/${c.id}`}
                    className="block text-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 transition"
                  >
                    فتح التفاصيل
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
