import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actRegistrationRequests } from "../../store/student/actRegistrationRequests";
import {
  Search,
  ChevronDown,
  User,
  Phone,
  MessageCircle,
  Calendar,
  GraduationCap,
  DollarSign,
  CheckCircle,
  XCircle,
  Filter,
  Clock,
  BookOpen,
} from "lucide-react";
import { actReject } from "../../store/student/reject/actReject";
import { actAcceptOnline } from "../../store/student/accept/onlineSchool/actAcceptOnline";
import { actOnlineOrOffline } from "../../store/student/accept/onlineOrOfflineCourses/actOnlineOrOffline";
import { Alert, LinearProgress, Snackbar } from "@mui/material";
import { resetRejectState } from "../../store/student/reject/rejectSlice";
import { resetAcceptOnlineState } from "../../store/student/accept/onlineSchool/acceptOnline";
import { resetAcceptOnlineOrOfflineState } from "../../store/student/accept/onlineOrOfflineCourses/onlineOrOfflineSlice";

const RegistrationRequests = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { list: registrationRequests } = useSelector(
    (state) => state.registrationRequests
  );
  const { loading, error, success } = useSelector(
    (state) => state.rejectedRequests
  );
  const {
    loading: acceptLoading,
    error: acceptError,
    success: acceptSuccess,
  } = useSelector((state) => state.acceptOnline);
  const {
    loading: acceptLoading2,
    error: acceptError2,
    success: acceptSuccess2,
  } = useSelector((state) => state.acceptOffline);

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedLevels, setExpandedLevels] = useState({});
  const [highlightedStudent, setHighlightedStudent] = useState(null);
  const studentRefs = useRef({});

  useEffect(() => {
    dispatch(actRegistrationRequests(token));
    if (success || acceptSuccess || acceptSuccess2) {
      dispatch(actRegistrationRequests(token));
    }
  }, [dispatch, token, success, acceptSuccess, acceptSuccess2]);

  const handleAccept = (apply) => {
    const planId = apply.planId;
    const studentId = apply.studentId;
    const parentId = apply.parentId;
    const scheduleTimeId = apply.scheduleTimeId;
    const courses = apply.courses.map((c) => c.courseId);
    console.log("Courses to accept:", scheduleTimeId);

    if (planId === 2) {
      dispatch(
        actAcceptOnline({
          token: token,
          data: {
            studentId: studentId,
            parentId: parentId,
            schedulTimeId: scheduleTimeId,
            planId: planId,
          },
        })
      );
    } else {
      dispatch(
        actOnlineOrOffline({
          token: token,
          data: {
            studentId: studentId,
            courses: courses,
            schedulTimeId: scheduleTimeId,
            planId: planId,
          },
        })
      );
    }
  };

  const handleReject = (id) => {
    if (window.confirm("Are you sure you want to reject this request?")) {
      dispatch(actReject({ token: token, id: id }));
    }
  };

  const toggleLevel = (index) => {
    setExpandedLevels((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Filter requests based on search query
  const filteredRequests = registrationRequests?.map((level) => ({
    ...level,
    studentApplies: level.studentApplies?.filter((apply) =>
      apply.studentName?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  // Calculate total requests
  const totalRequests = registrationRequests?.reduce(
    (acc, level) => acc + (level.studentApplies?.length || 0),
    0
  );

  useEffect(() => {
    if (success || acceptSuccess || acceptSuccess2) {
      const timer = setTimeout(() => {
        dispatch(resetRejectState());
        dispatch(resetAcceptOnlineState());
        dispatch(resetAcceptOnlineOrOfflineState());
      }, 800);
      return () => clearTimeout(timer);
    }
    if (error || acceptError || acceptError2) {
      const timer = setTimeout(() => {
        dispatch(resetRejectState());
        dispatch(resetAcceptOnlineState());
        dispatch(resetAcceptOnlineOrOfflineState());
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [
    success,
    dispatch,
    error,
    acceptSuccess,
    acceptError,
    acceptSuccess2,
    acceptError2,
  ]);

  // Handle phone call
  const handlePhoneCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Handle WhatsApp
  const handleWhatsApp = (whatsappNumber) => {
    const cleanNumber = whatsappNumber.replace(/[^\d+]/g, "");
    window.open(`https://wa.me/${cleanNumber}`, "_blank");
  };

  // Handle search result click
  const handleSearchResultClick = (levelIdx, applyId) => {
    setExpandedLevels((prev) => ({
      ...prev,
      [levelIdx]: true,
    }));
    setSearchQuery("");
    setHighlightedStudent(applyId);

    setTimeout(() => {
      const element = studentRefs.current[applyId];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);

    setTimeout(() => {
      setHighlightedStudent(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      {loading && (
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="info" sx={{ width: "100%" }}>
            <LinearProgress sx={{ mt: 1, mb: 1 }} />
            <span>Loading...</span>
          </Alert>
        </Snackbar>
      )}
      {acceptLoading && (
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="info" sx={{ width: "100%" }}>
            <LinearProgress sx={{ mt: 1, mb: 1 }} />
            <span>Loading...</span>
          </Alert>
        </Snackbar>
      )}
      {acceptLoading2 && (
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="info" sx={{ width: "100%" }}>
            <LinearProgress sx={{ mt: 1, mb: 1 }} />
            <span>Loading...</span>
          </Alert>
        </Snackbar>
      )}
      {error && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          onClose={() => dispatch(resetRejectState())}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      )}
      {acceptError && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          onClose={() => dispatch(resetAcceptOnlineState())}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {acceptError}
          </Alert>
        </Snackbar>
      )}
      {acceptError2 && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          onClose={() => dispatch(resetAcceptOnlineOrOfflineState())}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {acceptError2}
          </Alert>
        </Snackbar>
      )}
      {success && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          onClose={() => dispatch(resetRejectState())}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            {success}
          </Alert>
        </Snackbar>
      )}
      {acceptSuccess && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          onClose={() => dispatch(resetAcceptOnlineState())}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            {acceptSuccess}
          </Alert>
        </Snackbar>
      )}
      {acceptSuccess2 && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          onClose={() => dispatch(resetAcceptOnlineOrOfflineState())}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            {acceptSuccess2}
          </Alert>
        </Snackbar>
      )}
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-2">
                Registration Requests
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <GraduationCap className="text-blue-500" size={20} />
                Manage and review student applications
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <User size={20} />
                  <span className="font-bold text-lg">
                    {totalRequests || 0}
                  </span>
                  <span className="text-sm opacity-90">Total Requests</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 relative">
              <input
                type="text"
                placeholder="Search by student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
          {/* ✅ Dropdown search results */}
          {searchQuery &&
            filteredRequests?.some(
              (level) => level.studentApplies?.length > 0
            ) && (
              <div className="relative mt-2">
                <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                  {filteredRequests.map((level, levelIdx) =>
                    level.studentApplies?.map((apply, idx) => (
                      <div
                        key={`${levelIdx}-${idx}`}
                        onClick={() =>
                          handleSearchResultClick(levelIdx, apply.id)
                        }
                        className="px-4 py-3 flex flex-col gap-1 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">
                            {apply.studentName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {apply.studyLevelName}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          {apply.parent_Phones?.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Phone size={14} /> {apply.parent_Phones[0]}
                            </span>
                          )}
                          {apply.parent_WhatsApp_number && (
                            <span className="flex items-center gap-1">
                              <MessageCircle
                                size={14}
                                className="text-green-500"
                              />
                              {apply.parent_WhatsApp_number}
                            </span>
                          )}
                        </div>

                        {apply.appliedAt && (
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={14} />
                            {new Date(apply.appliedAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Requests List */}
      <div className="max-w-7xl mx-auto space-y-6">
        {filteredRequests?.map((level, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
          >
            {/* Accordion Header */}
            <button
              onClick={() => toggleLevel(index)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 flex items-center justify-between hover:from-blue-700 hover:to-blue-700 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                  <GraduationCap size={28} />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold">
                    {level.studyLevelName || "Unknown Level"}
                  </h2>
                  <p className="text-sm opacity-90">
                    {level.studentApplies?.length || 0} pending requests
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`transform transition-transform ${
                  expandedLevels[index] ? "rotate-180" : ""
                }`}
                size={24}
              />
            </button>

            {/* Accordion Content */}
            {expandedLevels[index] && (
              <div className="p-6 bg-gray-50">
                <div className="overflow-y-auto max-h-[700px]">
                  <div className="grid grid-cols-2 gap-2 pb-4">
                    {level.studentApplies?.map((apply, idx) => (
                      <div
                        key={idx}
                        ref={(el) => (studentRefs.current[apply.id] = el)}
                        className={`w-full bg-white rounded-xl overflow-hidden border transition-all duration-200 ${
                          highlightedStudent === apply.id
                            ? " shadow-lg scale-[0.95] border-yellow-500 ring-4 ring-yellow-400"
                            : "border-gray-200 shadow"
                        }`}
                      >
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                              <User className="text-blue-600" size={28} />
                            </div>
                            <div className="flex-1">
                              <h3
                                className={`text-xl font-bold text-white ${
                                  highlightedStudent === apply.id
                                    ? "animate-bounce"
                                    : ""
                                }`}
                              >
                                {apply.studentName || "No Name"}
                              </h3>
                              <p className="text-blue-100 text-sm">
                                Student Application
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 space-y-4">
                          {/* Contact Information */}
                          <div className="bg-blue-50 rounded-xl p-4">
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <Phone className="text-blue-500" size={18} />
                              Contact parent Information
                            </h4>
                            <div className="space-y-2">
                              {apply.parent_Phones &&
                                apply.parent_Phones.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {apply.parent_Phones.map(
                                      (phone, phoneIdx) => (
                                        <button
                                          key={phoneIdx}
                                          onClick={() => handlePhoneCall(phone)}
                                          className="flex items-center gap-2 bg-white border border-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                                        >
                                          <Phone size={14} />
                                          <span>{phone}</span>
                                        </button>
                                      )
                                    )}
                                  </div>
                                )}
                              {apply.parent_WhatsApp_number && (
                                <button
                                  onClick={() =>
                                    handleWhatsApp(apply.parent_WhatsApp_number)
                                  }
                                  className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors"
                                >
                                  <MessageCircle size={14} />
                                  <span>{apply.parent_WhatsApp_number}</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Academic Information */}
                          <div className="bg-purple-50 rounded-xl p-4">
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <BookOpen className="text-purple-500" size={18} />
                              Academic Details
                            </h4>
                            <div className="space-y-3">
                              {apply.planName && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">
                                    Plan:
                                  </span>
                                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                                    {apply.planName}
                                  </span>
                                </div>
                              )}
                              {apply.scheduleTimeName && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">
                                    Schedule:
                                  </span>
                                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium">
                                    {apply.scheduleTimeName}
                                  </span>
                                </div>
                              )}
                              {apply.courses?.length > 0 && (
                                <div>
                                  <span className="text-sm text-gray-500 block mb-2">
                                    Courses:
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {apply.courses.map((course, courseIdx) => (
                                      <span
                                        key={courseIdx}
                                        className="bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium"
                                      >
                                        {course.courseName}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Price & Date */}
                          <div className="grid grid-cols-2 gap-4">
                            {apply.totlePrice !== undefined && (
                              <div className="bg-green-50 rounded-xl p-4 text-center">
                                <DollarSign
                                  className="text-green-600 mx-auto mb-2"
                                  size={24}
                                />
                                <p className="text-xs text-gray-500 mb-1">
                                  Total Price
                                </p>
                                <p className="text-lg font-bold text-green-600">
                                  {apply.totlePrice} EGP
                                </p>
                              </div>
                            )}
                            {apply.appliedAt && (
                              <div className="bg-orange-50 rounded-xl p-4 text-center">
                                <Calendar
                                  className="text-orange-600 mx-auto mb-2"
                                  size={24}
                                />
                                <p className="text-xs text-gray-500 mb-1">
                                  Applied
                                </p>
                                <p className="text-sm font-semibold text-orange-600">
                                  {new Date(apply.appliedAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => handleAccept(apply)}
                              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                            >
                              <CheckCircle size={20} />
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(apply.id)}
                              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                            >
                              <XCircle size={20} />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {level.studentApplies?.length === 0 && (
                  <div className="text-center py-16">
                    <GraduationCap
                      className="mx-auto text-gray-300 mb-4"
                      size={80}
                    />
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">
                      No students found
                    </h3>
                    <p className="text-gray-400">
                      No students match your search criteria
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {(!filteredRequests || filteredRequests.length === 0) && (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <GraduationCap className="mx-auto text-gray-300 mb-6" size={100} />
            <h2 className="text-2xl font-bold text-gray-500 mb-3">
              No Registration Requests
            </h2>
            <p className="text-gray-400">
              There are no pending registration requests at the moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationRequests;