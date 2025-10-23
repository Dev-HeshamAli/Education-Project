// src/components/parent/ApplicationInfo.jsx
import { useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../api/BASE_URL";
import { setRequestDetails, setRequestStudentID } from "../../store/parent/parentSlice";

export default function ApplicationInfo({ request, onAccept, onDelete }) {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);

  const [busy, setBusy] = useState(null);      // "accept" | "delete" | null
  const [open, setOpen] = useState(false);     // modal
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [details, setDetails] = useState(null);

  const studentId = request?.id;
  const parentId  = request?.parentId;

  const photoSrc = useMemo(() => {
    if (request?.photo && /^https?:\/\//i.test(request.photo)) return request.photo;
    if (request?.photo) return request.photo;
    return "/assets/img/placeholder-avatar.png";
  }, [request?.photo]);

  const openDetailsModal = async () => {
    if (!studentId || !parentId || !token) return;
    try {
      setError("");
      setLoading(true);
      setOpen(true);

      const { data } = await axios.get(
        `${BASE_URL}/api/Parent/student-application-info/${studentId}/${parentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(setRequestDetails(data));
      dispatch(setRequestStudentID(studentId));
      setDetails(data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!onAccept || !studentId) return;
    try {
      setBusy("accept");
      await onAccept(studentId);
      if (open) await openDetailsModal(); // refresh modal
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !studentId) return;
    try {
      setBusy("delete");
      await onDelete(studentId);
      setOpen(false);
    } finally {
      setBusy(null);
    }
  };

  const v = (key) => (details?.[key] ?? "—");

  return (
    <>
      <div className="col-span-12 w-full mx-auto bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden transition-transform duration-300 hover:-translate-y-[2px]">
        <div className="flex items-center gap-4 p-5">
          <img
            src={photoSrc}
            alt={request?.name || "Child"}
            className="w-16 h-16 rounded-full border-2 border-indigo-500 object-cover shrink-0"
            loading="lazy"
          />

          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 truncate">
              {request?.name || `${details?.firstName || ""} ${details?.secondName || ""} ${details?.thirdName || ""}` || "—"}
            </h2>

            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700">
                <span className="font-semibold">Stage:</span> {request?.stage || details?.stageName || "—"}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700">
                <span className="font-semibold">Level:</span> {request?.study_Level || details?.studyLevelName || "—"}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700">
                Pending Review
              </span>
            </div>
          </div>

          <div className="ms-auto flex items-center gap-2">
            <button
              type="button"
              onClick={openDetailsModal}
              className="px-4 py-2 rounded-lg text-sm bg-slate-900 text-white hover:bg-slate-950"
            >
              View details
            </button>

            <button
              type="button"
              onClick={handleAccept}
              disabled={busy === "accept"}
              className={`px-4 py-2 rounded-lg text-sm text-white ${
                busy === "accept" ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {busy === "accept" ? "Accepting..." : "Accept"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={busy === "delete"}
              className={`px-4 py-2 rounded-lg text-sm text-white ${
                busy === "delete" ? "bg-rose-300 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {busy === "delete" ? "Deleting..." : "Reject"}
            </button>
          </div>
        </div>
      </div>

      {/* ===================== Modal (Smaller) ===================== */}
      {open && (
        <div
          className="fixed inset-0 z-[1000] top-[54px] flex items-center justify-center bg-black/40 px-3 py-28"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg md:max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-base md:text-lg font-semibold">Student Details</h3>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-slate-100" aria-label="Close">✕</button>
            </div>

            {/* Body (scrollable + smaller paddings) */}
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {loading && <div className="py-10 text-center text-slate-600">Loading…</div>}
              {!loading && error && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">{error}</div>
              )}

              {!loading && !error && (
                <>
                  {/* photoPath */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={v("photoPath") !== "—" ? v("photoPath") : "/assets/img/placeholder-avatar.png"}
                      alt={`${v("firstName")} ${v("secondName")} ${v("thirdName")}`}
                      className="w-16 h-16 rounded-full border object-cover"
                    />
                    <div>
                      <div className="text-lg font-bold">
                        {v("firstName")} {v("secondName")} {v("thirdName")}
                      </div>
                      <div className="text-slate-600 text-sm">
                        <span className="font-semibold">Stage:</span> {v("stageName")}
                        <span className="mx-2">•</span>
                        <span className="font-semibold">Level:</span> {v("studyLevelName")}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <Field label="First Name" value={v("firstName")} />
                    <Field label="Second Name" value={v("secondName")} />
                    <Field label="Third Name" value={v("thirdName")} />
                    <Field label="Birth Date" value={v("birthDate")} />
                    <Field label="Stage Name" value={v("stageName")} />
                    <Field label="Study Level Name" value={v("studyLevelName")} />
                    <Field label="Gender" value={v("gender")} />
                    <Field label="Country" value={v("country")} />
                    <Field label="Phone Number" value={v("phone_Number")} />
                    <LinkField label="Last Educational Qualifications" href={v("last_educational_qualifications")} />
                    <Field label="Email" value={v("email")} />
                    <PasswordField label="Password" value={v("password")} />
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm"
              >
                Close
              </button>
              {/*<button
                onClick={openDetailsModal}
                className="px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-sm"
              >
                Refresh
              </button>*/}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-slate-500 text-xs">{label}</div>
      <div className="text-slate-900 mt-0.5 break-all">{value ?? "—"}</div>
    </div>
  );
}

function LinkField({ label, href }) {
  const isValid = href && href !== "—";
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-slate-500 text-xs">{label}</div>
      <div className="text-slate-900 mt-0.5 break-all">
        {isValid ? (
          <a href={href} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
            Open file
          </a>
        ) : (
          "—"
        )}
      </div>
    </div>
  );
}

function PasswordField({ label, value }) {
  const [show, setShow] = useState(false);
  const text = value ?? "—";
  const masked = typeof text === "string" ? "•".repeat(Math.min(text.length, 12)) : "—";
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-slate-500 text-xs flex items-center justify-between">
        <span>{label}</span>
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="text-indigo-600 hover:underline text-xs"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      <div className="text-slate-900 mt-0.5 break-all">
        {show ? text : masked}
      </div>
    </div>
  );
}
