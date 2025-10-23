import { useDispatch, useSelector } from "react-redux";
import { fetchStudyLevels } from "../../store/shared/studyLevel/actGetStudyLevels";
import { actGetStudents } from "../../store/shared/data/allStudentsData/student/actGetStudents";
import { useEffect, useState, useMemo } from "react";
import { Dialog } from "@mui/material";
import StudentProfile from "../dashboard/StudentProfile";
import ParentProfile from "./ParentProfile";

const AllStudents = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const studyLevels = useSelector((state) => state.studyLevelsId.list || []);
  const StudentsInStudyLevels = useSelector(
    (state) => state.allStudentsInStudyLevel.list || []
  );
  const loading = useSelector(
    (state) => state.allStudentsInStudyLevel.loading || false
  );

  const [expanded, setExpanded] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showStudentProfile, setShowStudentProfile] = useState(false);
  const [showParentProfile, setShowParentProfile] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);

  useEffect(() => {
    dispatch(fetchStudyLevels(token));
  }, [dispatch, token]);

  const handleToggle = (id) => {
    if (expanded === id) {
      setExpanded(null);
      setSearchQuery("");
    } else {
      setExpanded(id);
      setSearchQuery("");
      dispatch(actGetStudents({ token, id }));
    }
  };

  const handleStudentClick = (studentId) => {
    setSelectedStudent(studentId);
  };

  const handleParentClick = (parentId, e) => {
    e.stopPropagation();
    setSelectedParent(parentId);
  };

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return StudentsInStudyLevels;

    const query = searchQuery.toLowerCase().trim();
    return StudentsInStudyLevels.filter((student) =>
      student.name?.toLowerCase().includes(query)
    );
  }, [StudentsInStudyLevels, searchQuery]);

  useEffect(() => {
    if (selectedStudent) {
      setShowStudentProfile(true);
      localStorage.setItem("3", selectedStudent);
    }
  }, [selectedStudent]);

  useEffect(() => {
    if (selectedParent) {
      setShowParentProfile(true);
      localStorage.setItem("4", selectedParent);
    }
  }, [selectedParent]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <Dialog
        open={showStudentProfile}
        onClose={() => {
          setShowStudentProfile(false);
          setSelectedStudent(null); // ✅ رجّع القيمة لـ null
          localStorage.removeItem("3");
        }}
        fullWidth
      >
        <StudentProfile
          onClose={() => {
            setShowStudentProfile(false);
            setSelectedStudent(null); // ✅ رجّع القيمة لـ null
            localStorage.removeItem("3");
          }}
        />
      </Dialog>

      <Dialog open={showParentProfile} fullWidth>
        <ParentProfile
          onClose={() => {
            setShowParentProfile(false);
            setSelectedParent(null);
            localStorage.removeItem("4");
          }}
        />
      </Dialog>

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 ">
          All Students
        </h1>
        <p className="text-gray-600 text-lg">
          Choose a study level to view its students
        </p>
      </div>

      {/* Study Levels Accordions */}
      <div className="space-y-4">
        {studyLevels.map((level) => (
          <div
            key={level.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
          >
            {/* Accordion Header */}
            <button
              onClick={() => handleToggle(level.id)}
              className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-100 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200"
            >
              <div className="flex items-center gap-4 ">
                <h3 className="text-xl font-bold text-gray-800">
                  {level.level}
                </h3>
                {expanded === level.id && StudentsInStudyLevels.length > 0 && (
                  <span className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                    {filteredStudents.length} طالب
                  </span>
                )}
              </div>
              <svg
                className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${
                  expanded === level.id ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Accordion Content */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                expanded === level.id
                  ? "max-h-[600px] opacity-100"
                  : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              {expanded === level.id && (
                <>
                  {/* Search Box */}
                  {StudentsInStudyLevels.length > 0 && (
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="ابحث عن طالب بالاسم..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                        <svg
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      {searchQuery && (
                        <p className="text-sm text-gray-600 mt-2 font-medium">
                          {filteredStudents.length} نتيجة
                        </p>
                      )}
                    </div>
                  )}

                  {/* Students List */}
                  <div
                    className="overflow-y-auto"
                    style={{ maxHeight: "450px" }}
                  >
                    {loading ? (
                      <div className="p-4 space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 animate-pulse"
                          >
                            <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : filteredStudents.length > 0 ? (
                      <ul className="divide-y divide-gray-100">
                        {filteredStudents.map((student) => (
                          <li
                            key={student.studentId}
                            className="p-4 hover:bg-blue-50 transition-colors duration-150 cursor-pointer group"
                            onClick={() =>
                              handleStudentClick(student.studentId)
                            }
                          >
                            <div className="flex items-center gap-4">
                              {/* Avatar */}
                              <div className="flex-shrink-0">
                                {student.photo ? (
                                  <img
                                    src={student.photo}
                                    alt={student.name}
                                    className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-blue-400 transition-all"
                                  />
                                ) : (
                                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold ring-2 ring-gray-200 group-hover:ring-blue-400 transition-all">
                                    {student.name?.[0] || "?"}
                                  </div>
                                )}
                              </div>

                              {/* Student Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                                  {student.name}
                                </h4>
                              </div>

                              {/* Parent Button */}
                              <button
                                onClick={(e) =>
                                  handleParentClick(student.parentId, e)
                                }
                                className="px-4 py-2 bg-white border-2 border-blue-500 text-blue-600 rounded-full font-semibold hover:bg-blue-500 hover:text-white transition-all duration-200 flex-shrink-0"
                              >
                                ولي الأمر
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : searchQuery ? (
                      <div className="p-12 text-center">
                        <svg
                          className="w-20 h-20 text-gray-300 mx-auto mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <p className="text-gray-600 font-medium text-lg mb-3">
                          لا توجد نتائج للبحث "{searchQuery}"
                        </p>
                        <button
                          onClick={() => setSearchQuery("")}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          إعادة تعيين البحث
                        </button>
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg
                            className="w-10 h-10 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium text-lg">
                          لا يوجد طلاب في هذا المستوى
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {studyLevels.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
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
          <p className="text-gray-500 text-xl font-medium">
            لا توجد مستويات دراسية متاحة
          </p>
        </div>
      )}
    </div>
  );
};

export default AllStudents;