import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Users,
  BookOpen,
  GraduationCap,
  Search,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { actGetStudentsInClass } from "../../store/shared/teacher/studentsInClass/actGetStudentsInClass";

const Students = () => {
  const dispatch = useDispatch();
  const { token, id } = useSelector((state) => state.auth);
  const [expandedLevels, setExpandedLevels] = useState({});
  const [expandedClasses, setExpandedClasses] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const { list: data } = useSelector((state) => state.studentInClass);

  useEffect(() => {
    dispatch(actGetStudentsInClass({ id: id, token }));
  }, [dispatch, id, token]);

  // البحث في الطلاب
  const getSearchResults = () => {
    if (!searchTerm.trim()) return [];

    const results = [];
    data.forEach((level) => {
      level.classes.forEach((classData) => {
        classData.students.forEach((student, index) => {
          if (
            student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            results.push({
              ...student,
              studyLevel: level.studyLevel,
              className: classData.className,
              classId: classData.classId,
              originalIndex: index,
            });
          }
        });
      });
    });

    return results;
  };

  const searchResults = getSearchResults();
  const showSearchResults = searchTerm.trim() && searchResults.length > 0;

  const toggleLevel = (level) => {
    setExpandedLevels((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  const toggleClass = (classId) => {
    setExpandedClasses((prev) => ({
      ...prev,
      [classId]: !prev[classId],
    }));
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const highlightSearchTerm = (text, term) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase()
        ? React.createElement(
            "span",
            { key: index, className: "bg-yellow-200" },
            part
          )
        : part
    );
  };

  const navigateToStudent = (student) => {
    setExpandedLevels((prev) => ({ ...prev, [student.studyLevel]: true }));
    setExpandedClasses((prev) => ({ ...prev, [student.classId]: true }));
    clearSearch();

    // التمرير إلى الطالب بعد توسيع الفصل
    setTimeout(() => {
      const element = document.getElementById(
        `student-${student.classId}-${student.originalIndex}`
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("animate-pulse", "bg-yellow-100");
        setTimeout(() => {
          element.classList.remove("animate-pulse", "bg-yellow-100");
        }, 2000);
      }
    }, 100);
  };

  return (
    <div className=" bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <GraduationCap className="text-indigo-600" size={40} />
            إدارة بيانات الطلاب
          </h1>
          <p className="text-gray-600 text-lg">
            نظام عرض شامل للمراحل الدراسية والفصول والطلاب
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pr-10 pl-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right"
              placeholder="البحث عن طالب..."
              dir="rtl"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 left-0 pl-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {showSearchResults && (
          <div className="mb-6 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-yellow-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Search size={20} />
                نتائج البحث ({searchResults.length})
              </h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="grid gap-2 p-4">
                {searchResults.map((student, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {highlightSearchTerm(student.studentName, searchTerm)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {student.studyLevel.toUpperCase()} -{" "}
                          {student.className}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigateToStudent(student)}
                      className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                    >
                      عرض
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Search Results Message */}
        {searchTerm.trim() && !showSearchResults && (
          <div className="mb-6 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-8 text-center text-gray-500">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">
                لم يتم العثور على نتائج للبحث "{searchTerm}"
              </p>
              <p className="text-sm mt-2">
                جرب كلمات مختلفة أو تأكد من صحة الإملاء
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!showSearchResults && (
          <div className="space-y-6">
            {data.map((levelData, levelIndex) => (
              <div
                key={levelIndex}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              >
                {/* Level Header */}
                <div
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                  onClick={() => toggleLevel(levelData.studyLevel)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <GraduationCap className="text-white" size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          المرحلة الدراسية: {levelData.studyLevel.toUpperCase()}
                        </h2>
                        <p className="text-white/80 text-sm">
                          {levelData.classes.length} فصل |{" "}
                          {levelData.courses.length} مادة
                        </p>
                      </div>
                    </div>
                    <div className="text-white">
                      {expandedLevels[levelData.studyLevel] ? (
                        <ChevronDown size={28} />
                      ) : (
                        <ChevronRight size={28} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Level Content */}
                {expandedLevels[levelData.studyLevel] && (
                  <div className="p-6 bg-gray-50">
                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Classes Section */}
                      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Users className="text-blue-600" size={20} />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">
                            الفصول
                          </h3>
                        </div>

                        <div className="space-y-4">
                          {levelData.classes.map((classData) => (
                            <div
                              key={classData.classId}
                              className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                              {/* Class Header */}
                              <div
                                className="bg-blue-50 p-4 cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                                onClick={() => toggleClass(classData.classId)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-semibold text-gray-800">
                                      {classData.className}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {classData.students.length} طالب
                                    </p>
                                  </div>
                                  <div className="text-blue-600">
                                    {expandedClasses[classData.classId] ? (
                                      <ChevronDown size={20} />
                                    ) : (
                                      <ChevronRight size={20} />
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Students List */}
                              {expandedClasses[classData.classId] && (
                                <div className="bg-white">
                                  {classData.students.length > 0 ? (
                                    <div className="max-h-80 overflow-y-auto p-4">
                                      <div className="grid gap-2">
                                        {classData.students.map(
                                          (student, studentIndex) => (
                                            <div
                                              key={studentIndex}
                                              id={`student-${classData.classId}-${studentIndex}`}
                                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                                {studentIndex + 1}
                                              </div>
                                              <span className="text-gray-800 font-medium break-words">
                                                {student.studentName}
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                      {/* Show count if many students */}
                                      {classData.students.length > 10 && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 text-center">
                                          <p className="text-sm text-gray-500">
                                            إجمالي الطلاب:{" "}
                                            {classData.students.length}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-center py-8 text-gray-500">
                                      <Users
                                        size={48}
                                        className="mx-auto mb-2 opacity-50"
                                      />
                                      <p>لا يوجد طلاب في هذا الفصل</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Courses Section */}
                      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <BookOpen className="text-green-600" size={20} />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">
                            المواد الدراسية
                          </h3>
                        </div>

                        <div className="grid gap-4">
                          {levelData.courses.map((course, courseIndex) => (
                            <div
                              key={course.courseId}
                              className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 hover:shadow-md transition-all duration-200"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                                  {courseIndex + 1}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800">
                                    {course.courseName}
                                  </h4>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            إحصائيات عامة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {data.length}
              </div>
              <div className="text-gray-600">المراحل دراسية</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {data.reduce((total, level) => total + level.classes.length, 0)}
              </div>
              <div className="text-gray-600">الفصول </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {data.reduce(
                  (total, level) =>
                    total +
                    level.classes.reduce(
                      (classTotal, classData) =>
                        classTotal + classData.students.length,
                      0
                    ),
                  0
                )}
              </div>
              <div className="text-gray-600"> الطلاب</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
