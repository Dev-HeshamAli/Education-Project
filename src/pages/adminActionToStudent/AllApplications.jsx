import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ApplicationInfo from "../../components/admin/ApplicationInfo";
import { BASE_URL } from "../../api/BASE_URL";

function AllApplications() {
  const token = useSelector((state) => state.auth.token);

  // table data
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);

  // metadata from API
  const [pageMeta, setPageMeta] = useState({
    pageNumber: 1,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  // fetch
  async function getApplications(p = page, size = pageSize) {
    try {
      setLoading(true);
      setErr("");

      const { data } = await axios.get(
        `${BASE_URL}/api/Admin/All-Applications?PageNumber=${p}&PageSize=${size}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const items = data?.items || data?.data || data?.results || [];
      setRequests(Array.isArray(items) ? items : []);

      setPageMeta({
        pageNumber: Number(data?.pageNumber) || p,
        totalPages: Number(data?.totalPages) || 1,
        hasPreviousPage: Boolean(data?.hasPreviousPage) || false,
        hasNextPage: Boolean(data?.hasNextPage) || false,
      });
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Failed to load applications.");
      setRequests([]);
      setPageMeta((m) => ({ ...m, hasNextPage: false, hasPreviousPage: page > 1 }));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getApplications(page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, token]);

  // actions (optimistic + refetch)
  async function handleDelete(id) {
    const prev = requests;
    setRequests((p) => p.filter((req) => req.id !== id));

    const t = toast.loading("Deleting application...");
    try {
      await axios.delete(`${BASE_URL}/api/Admin/Rejection-Application/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.dismiss(t);
      toast.success("Application deleted.");

      if (prev.length === 1 && page > 1) {
        setPage((pg) => Math.max(1, pg - 1));
      } else {
        getApplications(page, pageSize);
      }
    } catch (e) {
      setRequests(prev);
      toast.dismiss(t);
      toast.error(e?.response?.data?.message || e?.message || "Failed to delete. Try again.");
    }
  }

  async function handleAccept(id) {
    const prev = requests;
    setRequests((p) => p.filter((req) => req.id !== id));

    const t = toast.loading("Accepting application...");
    try {
      await axios.put(
        `${BASE_URL}/api/Admin/Acceptance-Application/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.dismiss(t);
      toast.success("Application accepted.");

      if (prev.length === 1 && page > 1) {
        setPage((pg) => Math.max(1, pg - 1));
      } else {
        getApplications(page, pageSize);
      }
    } catch (e) {
      setRequests(prev);
      toast.dismiss(t);
      toast.error(e?.response?.data?.message || e?.message || "Failed to accept. Try again.");
    }
  }

  // pager UI
  const Pages = () => {
    const canGoPrev = pageMeta?.hasPreviousPage ?? (page > 1 && requests.length > 0);
    const canGoNext = pageMeta?.hasNextPage ?? (requests.length === pageSize);

    if (!canGoPrev && !canGoNext) return null;

    return (
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {/* meta indicator */}
        <div className="text-sm text-slate-600">
          Page <strong>{pageMeta?.pageNumber || page}</strong> of{" "}
          <strong>{pageMeta?.totalPages || "—"}</strong>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!canGoPrev}
            className={`px-3 py-2 rounded-lg border text-sm ${
              !canGoPrev
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            Previous
          </button>

          <span className="px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg">
            Page {page}
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={!canGoNext}
            className={`px-3 py-2 rounded-lg border text-sm ${
              !canGoNext
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            Next
          </button>
        </div>

        {/* page size */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Page size:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              const v = Number(e.target.value) || 10;
              setPageSize(v);
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
          >
            {[2, 5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center bg-gray-100">
      <div className="container pt-[80px] pb-[320px] max-md:pb-[380px] max-w-6xl max-xl:px-10">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6">All Applications</h1>

        {/* states */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
            Loading…
          </div>
        )}

        {!loading && err && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
            {err}
          </div>
        )}

        {!loading && !err && (
          <>
            <section className="grid grid-cols-12 gap-9">
              {requests && requests.length > 0 ? (
                requests.map((item) => (
                  <ApplicationInfo
                    key={item.id}
                    request={item}
                    onDelete={handleDelete}
                    onAccept={handleAccept}
                  />
                ))
              ) : (
                <div className="col-span-12 text-center text-gray-500">
                  No applications on this page.
                </div>
              )}
            </section>

            <Pages />
          </>
        )}
      </div>
    </div>
  );
}

export default AllApplications;
