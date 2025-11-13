import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setStudentID } from "../../store/dataIDs/dataIDsSlice"; // عدّلي المسار لو لزم
import { User, GraduationCap, BookOpen, Settings, Layers } from "lucide-react";

export default function ChildCard({ child }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --------- بيانات أساسية مع fallbacks ---------
  const name  = child?.name || child?.fullName || "بدون اسم";
  const stage = child?.stage || child?.educationStage || "مرحلة غير محدّدة";
  const level = child?.study_Level || child?.studyLevel || child?.grade || "صف غير محدّد";
  const status = child?.status || child?.enrollmentStatus;
  const img   = child?.photo || child?.image || "/child3.png";
  const id    = child?.id || child?._id;

  // --------- خطة الطالب (تطبيع القيم من الـ API) ----------
  const planRaw = child?.plan; // ممكن تكون null
  const normalize = (v) =>
    typeof v === "string" ? v.toLowerCase().replace(/\s+/g, "") : "";

  // قيم مدعومة:
  // offlinecourses  -> حصص مسجلة
  // onlinecourses   -> حصص أونلاين
  // onlineschool    -> مدرسة أونلاين
  const planMap = {
    offlinecourses : "حصص مسجلة",
    onlinecourses: "حصص أونلاين",
    onlineschool: "مدرسة أونلاين",
  };

  const planKey = normalize(planRaw);
  const planLabel = planKey ? (planMap[planKey] ?? planRaw) : planKey == "Ofline Courses" ? "حصص مسجلة" : null;
  const hasPlan = Boolean(planLabel);
  // --------- ألوان شارة الحالة ----------
  const getStatusColor = (s) => {
    switch (s?.toLowerCase?.()) {
      case "active":
      case "نشط":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
      case "غير نشط":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
      case "قيد المراجعة":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  // --------- أيقونة المرحلة ----------
  const getStageIcon = (s) => {
    if (s?.includes("ابتدائي") || s?.toLowerCase?.().includes("primary")) return "";
    if (s?.includes("إعدادي") || s?.toLowerCase?.().includes("middle"))  return "";
    if (s?.includes("ثانوي")  || s?.toLowerCase?.().includes("secondary")) return "";
    return "";
  };

  // --------- التنقل لاختيار/تغيير الخطة ----------
  const handleChooseOrChangePlan = () => {
    if (!id) return alert("لا يوجد رقم للطالب.");
    dispatch(setStudentID(id));
    navigate("/parent/plans"); // من غير بارامترز
  };

  return (
    <article dir="rtl" className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3">
      <div className="group h-full rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-lg hover:border-neutral-300 transition-all duration-300 overflow-hidden">

        {/* صورة الطالب */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
          <img
            src={img}
            alt={`صورة ${name}`}
            className="mx-auto h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.currentTarget.src = "/child3.png"; }}
          />

          {/* شارة الحالة */}
          {status && (
            <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold border ${getStatusColor(status)} backdrop-blur-sm`}>
              {status}
            </span>
          )}

          {/* أيقونة المرحلة */}
          <div className="absolute left-3 top-3 text-2xl">
            {getStageIcon(stage)}
          </div>
        </div>

        {/* محتوى الكارت */}
        <div className="p-5">
          {/* اسم الطالب */}
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-[#f97316] flex-shrink-0" />
            <h4 className="text-lg font-bold text-slate-900 line-clamp-1" title={name}>
              {name}
            </h4>
          </div>

          {/* المرحلة والصف */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-slate-500" />
              <span className="text-slate-700 font-medium">{stage}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-slate-500" />
              <span className="text-slate-700 font-medium">{level}</span>
            </div>
          </div>

          {/* الخطة الحالية (إن وجدت) */}
          {hasPlan && (
            <div className="mb-4 rounded-xl border border-neutral-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-sm">
                <Layers className="h-4 w-4 text-slate-600" />
                <span className="text-slate-600">الخطة الحالية:</span>
                <span className="ms-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-800">
                  {planLabel}
                </span>
              </div>
            </div>
          )}

          {/* فاصل */}
          <div className="border-t border-neutral-200 mb-4" />

          {/* زر العمليات (يتغيّر حسب وجود الخطة) */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleChooseOrChangePlan}
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-[#f97316] bg-white text-[#f97316] text-sm font-semibold py-3 hover:bg-[#f97316] hover:text-white focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 transition-all duration-200"
            >
              <Settings className="h-4 w-4" />
              {hasPlan ? "تغيير الخطة" : "اختيار خطة"}
            </button>
          </div>

          {/* معلومات إضافية (اختياري) */}
          {child?.lastActivity && (
            <div className="mt-4 pt-3 border-t border-neutral-100">
              <p className="text-xs text-slate-500 text-center">
                آخر نشاط: {new Date(child.lastActivity).toLocaleDateString("ar-EG")}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
