import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actGetParent } from "../../store/shared/data/allStudentsData/parent/actGetParent";
import { X } from "lucide-react";

const ParentProfile = ({ onClose }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const id = localStorage.getItem("4");

  const { list: parentData, loading } = useSelector(
    (state) => state.parentProfile
  );

  useEffect(() => {
    dispatch(actGetParent({ id, token }));
  }, [dispatch, id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!parentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-24 h-24 text-gray-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-500 text-xl">
            لم يتم العثور على بيانات ولي الأمر
          </p>
        </div>
      </div>
    );
  }

  const {
    fullName,
    email,
    whatsApp_number,
    phones,
    jobs,
    children,
    students_Count,
  } = parentData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-2 sm:p-2 lg:p-2">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
      >
        <X size={30} />
      </button>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold shadow-lg">
                {fullName?.[0] || "؟"}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-1">
                  {fullName}
                </h1>
                <p className="text-blue-100 text-lg">
                  ولي أمر {students_Count} طالب
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              معلومات التواصل
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">
                    البريد الإلكتروني
                  </p>
                  <p className="text-gray-800 font-semibold">
                    {email || "غير متوفر"}
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">واتساب</p>
                  <p className="text-gray-800 font-semibold" dir="ltr">
                    {whatsApp_number || "غير متوفر"}
                  </p>
                </div>
              </div>

              {/* Phone Numbers */}
              {phones && phones.length > 0 && (
                <div className="md:col-span-2 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">أرقام الهاتف</p>
                      <div className="flex flex-wrap gap-2">
                        {phones.map((phone, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white border border-purple-200 text-gray-700 rounded-full text-sm font-medium"
                            dir="ltr"
                          >
                            {phone}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Jobs Section */}
        {jobs && jobs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              الوظائف
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      job.gender === "Male" ? "bg-blue-500" : "bg-pink-500"
                    }`}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-gray-800">{job.job}</p>
                    <p className="text-sm text-gray-500">
                      {job.gender === "Male" ? "الأب" : "الأم"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Children Section */}
        {children && children.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-blue-600"
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
              الأبناء ({children.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    {/* Child Photo */}
                    <div className="flex-shrink-0">
                      {child.photo ? (
                        <img
                          src={child.photo}
                          alt={child.name}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-blue-400 transition-all"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold ring-2 ring-gray-200 group-hover:ring-blue-400 transition-all">
                          {child.name?.[0] || "؟"}
                        </div>
                      )}
                    </div>

                    {/* Child Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                        {child.name}
                      </h3>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                          {child.study_Level}
                        </span>
                        {child.isPayed && (
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                            ✓ مدفوع
                          </span>
                        )}
                      </div>

                      {child.plan && (
                        <p className="text-xs text-gray-500 mt-2">
                          📚 {child.plan}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentProfile;