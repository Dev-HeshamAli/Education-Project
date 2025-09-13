import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from "../../api/BASE_URL";

export default function CourseLectures() {
  const { courseId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');

  const token = useSelector((s) => s.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    async function fetchLectures() {
      try {
        setLoading(true);
        setErr('');
        const { data } = await axios.get(
          
          `${BASE_URL}/api/Course/course-Lec-OnlinPlan/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (alive) setLectures(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setErr(err?.response?.data?.title || err.message || 'حدث خطأ غير متوقع');
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchLectures();
    return () => {
      alive = false;
    };
  }, [courseId, token, navigate]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return lectures;
    return lectures.filter((lec) =>
      lec.teacherName?.toLowerCase().includes(s) ||
      String(lec.lecture).includes(s)
    );
  }, [q, lectures]);

  return (
    <section dir="rtl" className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-10 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              محاضرات الكورس
            </h1>
            <p className="text-gray-600 mt-1">رقم الكورس #{courseId}</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="ابحث برقم أو اسم المدرّس…"
              className="w-full md:w-80 rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-indigo-500"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <span className="hidden md:inline-flex items-center rounded-xl bg-white px-3 py-2 text-sm text-gray-600 border border-gray-200">
              {loading ? "…" : `${filtered.length} محاضرة`}
            </span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-gray-200 p-5">
                <div className="h-6 w-2/3 bg-gray-100 animate-pulse rounded mb-4" />
                <div className="h-5 w-1/3 bg-gray-100 animate-pulse rounded mb-2" />
                <div className="h-4 w-1/2 bg-gray-100 animate-pulse rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && err && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 p-4">
            {err}
          </div>
        )}

        {/* Empty */}
        {!loading && !err && filtered.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600">
            لا توجد محاضرات متاحة لهذا الكورس.
          </div>
        )}

        {/* List */}
        {!loading && !err && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((lec) => (
              <article
                key={lec.id}
                className="group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-extrabold text-gray-900">
                    المحاضرة #{lec.lecture}
                  </h3>
                  <span className="shrink-0 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1">
                    ID: {lec.id}
                  </span>
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  <p>
                    المدرّس:{" "}
                    <span className="font-semibold text-gray-800">
                      {lec.teacherName ?? "غير محدد"}
                    </span>
                  </p>
                </div>
               {/* {lec.summaryFile && (
                  <a
                    href={lec.summaryFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-center py-2"
                  >
                    تحميل الملخص
                  </a>
                )} */}

                <Link to={`/student/watch-lecture/${lec.id}`}
                  className="mt-4 inline-block w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-center py-2"
                >فتح المحاضرة</Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
