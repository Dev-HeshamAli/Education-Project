import { useDispatch, useSelector } from "react-redux";
import { actActiveLec } from "../../store/createTeacher/activeLec/actActiveLec";
import { resetActiveLecState } from "../../store/createTeacher/activeLec/activeLec";
import { useEffect } from "react";
import { Snackbar, Alert, LinearProgress } from "@mui/material";
import { resetEndLecState } from "../../store/createTeacher/endLec/endLec";
import { actEndLec } from "../../store/createTeacher/endLec/actEndLec";

const EditLecture = ({ onClose, selectedLecture }) => {
  const id = selectedLecture?.id;
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { loading, success, error } = useSelector(
    (state) => state.activeLecture
  );
  const {
    loading: endLecLoading,
    success: endLecSuccess,
    error: endLecError,
  } = useSelector((state) => state.endLec);
  const handleStartLec = () => {
    dispatch(actActiveLec({ id: id, token }));
  };
  const handleEndLec = () => {
    dispatch(actEndLec({ id: id, token }));
  };
  useEffect(() => {
    let timerSuccess, timerError;

    if (success || endLecSuccess) {
      timerSuccess = setTimeout(() => {
        dispatch(resetActiveLecState());
        dispatch(resetEndLecState());
        onClose();
      }, 200);
    }

    if (error || endLecError) {
      timerError = setTimeout(() => {
        dispatch(resetActiveLecState());
        dispatch(resetEndLecState());
      }, 8000);
    }

    return () => {
      if (timerSuccess) clearTimeout(timerSuccess);
      if (timerError) clearTimeout(timerError);
    };
  }, [success, error, endLecSuccess, endLecError, dispatch, onClose]);

  if (!selectedLecture) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              لا توجد محاضرة محددة
            </h3>
            <p className="text-gray-500 mb-6">
              الرجاء اختيار محاضرة لعرض تفاصيلها
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {loading && (
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="info" sx={{ width: "100%" }}>
            <LinearProgress sx={{ mt: 1, mb: 1 }} />
            Active Lecture
          </Alert>
        </Snackbar>
      )}
      {error && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      )}

      {success && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            {success}
          </Alert>
        </Snackbar>
      )}
      {endLecLoading && (
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="info" sx={{ width: "100%" }}>
            <LinearProgress sx={{ mt: 1, mb: 1 }} />
            End Lecture
          </Alert>
        </Snackbar>
      )}
      {endLecError && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {endLecError}
          </Alert>
        </Snackbar>
      )}

      {endLecSuccess && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            {endLecSuccess}
          </Alert>
        </Snackbar>
      )}
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">تفاصيل المحاضرة</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Course Name */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
            <div className="flex items-center mb-3">
              <div className="bg-blue-500 rounded-full p-2 mr-3">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <label className="text-sm font-medium text-blue-800 mr-2">
                اسم المادة
              </label>
            </div>
            <p className="text-xl font-bold text-blue-900 mr-9">
              {selectedLecture.courseName}
            </p>
          </div>

          {/* Study Level & Duration */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
              <div className="flex items-center mb-3">
                <div className="bg-green-500 rounded-full p-2 mr-3">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <label className="text-sm font-medium text-green-800  mr-2">
                  المستوى الدراسي
                </label>
              </div>
              <p className="text-lg font-bold text-green-900 mr-9">
                {selectedLecture.studyLevel}
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-5 rounded-xl border border-orange-100">
              <div className="flex items-center mb-3">
                <div className="bg-orange-500 rounded-full p-2 mr-3">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <label className="text-sm font-medium text-orange-800  mr-2">
                  مدة المحاضرة
                </label>
              </div>
              <p className="text-lg font-bold text-orange-900 mr-9">
                {selectedLecture.duration}
              </p>
            </div>
          </div>

          {/* Time Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-5 rounded-xl border border-purple-100">
              <div className="flex items-center mb-3">
                <div className="bg-purple-500 rounded-full p-2 mr-3">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <label className="text-sm font-medium text-purple-800  mr-2">
                  وقت البداية
                </label>
              </div>
              <p className="text-lg font-bold text-purple-900 mr-9">
                {selectedLecture.startTime}
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-5 rounded-xl border border-red-100">
              <div className="flex items-center mb-3">
                <div className="bg-red-500 rounded-full p-2 mr-3">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <label className="text-sm font-medium text-red-800  mr-2">
                  وقت النهاية
                </label>
              </div>
              <p className="text-lg font-bold text-red-900 mr-9">
                {selectedLecture.endTime}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`rounded-full p-2 mr-3 ${
                    selectedLecture.isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                >
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        selectedLecture.isActive
                          ? "M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      }
                    />
                  </svg>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mr-2">
                    حالة المحاضرة
                  </label>
                  <span
                    className={`text-lg font-bold mr-2 ${
                      selectedLecture.isActive
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedLecture.isActive ? "نشطة" : "غير نشطة"}
                  </span>
                </div>
              </div>
              <div
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedLecture.isActive
                    ? "bg-green-100 text-green-800 "
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedLecture.isActive ? "متاحة الآن" : "غير متاحة"}
              </div>
            </div>
          </div>

          {/* Actions */}
          {selectedLecture.isActive && selectedLecture.lectureLink && (
            <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 p-5 rounded-xl border border-indigo-100">
              <label className="text-sm font-medium text-indigo-800 block mb-4">
                الإجراءات المتاحة
              </label>
              <div className="flex flex-wrap gap-3">
                <a
                  href={selectedLecture.lectureLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <svg
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  دخول المحاضرة
                </a>
                <button
                  onClick={handleEndLec}
                  className="inline-flex items-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  انهاء المحاضرة
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl border-t">
          <div className="flex justify-between">
            <button
              style={{ display: selectedLecture.isActive ? "none" : "flex" }}
              onClick={handleStartLec}
              className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              بدء المحاضرة
            </button>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-8 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLecture;
