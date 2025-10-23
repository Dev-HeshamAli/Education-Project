// src/pages/parent/ShowPlans.jsx
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setPlanID,
  selectStudentID as selectStudentIDSelector,
} from "../../store/dataIDs/dataIDsSlice";
import { Check, Star, Zap } from "lucide-react";

export default function ShowPlans() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // هنستخدم نفس اسم المتغيّر اللي طلبتيه
  const selectStudentID = useSelector(selectStudentIDSelector);

  const plans = [
    {
      id: 2,
      name: "التحاق بالمدرسة",
      discount: "خصم 50%",
      icon: <Star className="w-6 h-6" />,
      features: [
        "جدول دراسي ثابت (صباحي أو مسائي)",
        "حصص مباشرة أونلاين مع المعلمين عبر Zoom",
        "الحصول على الحصة مكتوبة PDF",
        "دردشة، تلخيص، وترجمة الـ PDF باستخدام الذكاء الاصطناعي",
        "اختبار النطق في اللغة الإنجليزية باستخدام الذكاء الاصطناعي",
        "أنشطة اجتماعية افتراضية",
        "أفلام تفاعلية ورسوم متحركة",
        "متابعة مستوى الطالب بشكل دوري",
      ],
    },
    {
      id: 3,
      name: "خطة المواد المنفصلة",
      discount: "خصم 50%",
      icon: <Zap className="w-6 h-6" />,
      features: [
        "اختر مادة واحدة أو أكثر حسب الحاجة",
        "حصص مباشرة أونلاين مع المعلمين عبر Zoom",
        "الحصول على الحصة مكتوبة PDF",
        "دردشة، تلخيص، وترجمة الـ PDF باستخدام الذكاء الاصطناعي",
        "اختبار النطق في اللغة الإنجليزية باستخدام الذكاء الاصطناعي",
        "أنشطة اجتماعية افتراضية",
        "أفلام تفاعلية ورسوم متحركة",
        "متابعة مستوى الطالب بشكل دوري",
      ],
    },
    {
      id: 1,
      name: "نظام الحصص المسجلة",
      discount: "خصم 50%",
      icon: <Check className="w-6 h-6" />,
      features: [
        "فيديوهات مسجلة لجميع المواد",
        "دردشة، تلخيص، وترجمة الـ PDF باستخدام الذكاء الاصطناعي",
        "اختبار النطق في اللغة الإنجليزية باستخدام الذكاء الاصطناعي",
        "أفلام تفاعلية ورسوم متحركة",
      ],
    },
  ];

  const handleChoosePlan = (planId) => {
    if (!selectStudentID) {
      // مفيش طالب محدد في الـstore
      alert("من فضلك اختاري الطالب أولًا.");
      navigate(-1);
      return;
    }
    // خزّن PlanID في الـstore
    dispatch(setPlanID(planId));

    // التنقّل بدون بارامترز
    if (planId === 2) navigate("/parent/online-plan");
    else if (planId === 3) navigate("/parent/online-courses");
    else navigate("/parent/offline-courses");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-16"
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          اختر الخطة المناسبة لك
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          جميع خططنا مصممة لتوفير أفضل تجربة تعليمية مع أحدث تقنيات الذكاء
          الاصطناعي
        </p>

        {/* تحذير بسيط لو مفيش طالب محدد */}
        {!selectStudentID && (
          <div className="mt-6 inline-block rounded-xl border border-amber-200 bg-amber-50 text-amber-800 px-4 py-2 text-sm">
            لا يوجد طالب محدد — من فضلك ارجعي وحددي الطالب من الصفحة السابقة.
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 md:grid-cols-2 gap-8 px-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="relative group flex flex-col rounded-3xl border border-neutral-200 bg-white transition-all duration-300 overflow-hidden transform hover:scale-105 hover:shadow-2xl shadow-lg"
          >
            {/* Discount Ribbon */}
            <div className="absolute top-0 right-0 overflow-hidden w-32 h-32 pointer-events-none z-20">
              <div className="absolute right-[-38px] top-[22px] w-[170px] rotate-45 bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs font-extrabold py-2 text-center shadow-xl">
                🔥 {plan.discount}
              </div>
            </div>

            {/* Plan Header */}
            <div className="px-8 pt-8 pb-6 text-center border-b border-neutral-100 bg-slate-800">
              <div className="flex items-center justify-center mb-3 text-orange-400">
                {plan.icon}
              </div>
              <h3 className="text-xl font-bold text-white tracking-wide mb-2">
                {plan.name}
              </h3>
            </div>

            {/* Features */}
            <div className="flex-1 p-8">
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-slate-700 group"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm leading-relaxed group-hover:text-slate-800 transition-colors">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action */}
            <div className="px-8 pb-8">
              <button
                type="button"
                onClick={() => handleChoosePlan(plan.id)}
                className="block w-full text-center rounded-2xl py-4 px-6 transition-all duration-300 font-bold text-lg shadow-lg transform hover:scale-105 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white"
                disabled={!selectStudentID}
                title={!selectStudentID ? "اختاري الطالب أولًا" : ""}
              >
                اختر الخطة
                <span className="inline-block mr-2 text-xl">👈</span>
              </button>
            </div>

            {/* Decor */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-orange-300 rounded-full opacity-60"></div>
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-blue-300 rounded-full opacity-40"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
