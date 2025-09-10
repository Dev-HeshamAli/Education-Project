function ProblemCard({ problem, onDelete }) {
  return (
    <div className="flex items-center justify-center mt-10" dir="rtl">
      <div className="relative bg-white w-[95%] max-w-2xl rounded-2xl shadow-xl p-6">
        {/* العنوان */}
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold">
            {problem.problem || "المشكلة"}
          </h2>
        </div>

        {/* التفاصيل */}
        <div className="mt-4 space-y-3">
          <div className="text-sm text-gray-500">
            {problem.createdAt
              ? `تاريخ الإرسال: ${new Date(problem.createdAt).toLocaleString()}`
              : "تاريخ الإرسال غير متاح"}
          </div>

          <div className="text-sm">
            <span className="font-medium">الحالة: </span>
            {problem.response ? "تم الحل" : "قيد الانتظار"}
          </div>

          <p className="leading-7 whitespace-pre-wrap text-gray-800 mt-2">
            {problem.response || "لا يوجد رد حتى الآن."}
          </p>
        </div>

        {/* الأزرار */}
        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
            onClick={() => onDelete(problem.id)}
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProblemCard;
