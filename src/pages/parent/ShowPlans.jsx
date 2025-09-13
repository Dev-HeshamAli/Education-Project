import { useParams, Link } from "react-router-dom";

const ShowPlans = () => {
  const { studentId } = useParams();

  const plans = [
    {
      id: 2,
      name: "التحاق بالمدرسة",
      discount: "خصم 50%",
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
      features: [
        "فيديوهات مسجلة لجميع المواد",
        "دردشة، تلخيص، وترجمة الـ PDF باستخدام الذكاء الاصطناعي",
        "اختبار النطق في اللغة الإنجليزية باستخدام الذكاء الاصطناعي",
        "أفلام تفاعلية ورسوم متحركة",
      ],
    },
  ];

  return (
    <div dir="rtl" className="w-full py-12 bg-[#f3f4f6]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="relative flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.1)] overflow-hidden"
          >
            {/* Ribbon الخصم (مائل وبارز) */}
            <div className="absolute top-0 right-0 overflow-hidden w-28 h-28 pointer-events-none">
              <div className="absolute left-[-36px] top-[20px] w-[160px] rotate-45 bg-orange-400 text-white text-xs font-extrabold py-1 text-center shadow-lg">
                🔥 {plan.discount}
              </div>
            </div>

            {/* عنوان الخطة */}
            <div className="px-6 pt-6 pb-4 text-center border-b border-neutral-100 bg-slate-800">
              <h3 className="text-lg font-bold text-white tracking-wide">
                {plan.name}
              </h3>
            </div>

            {/* المميزات */}
            <ul className="flex-1 list-disc pr-6 pl-4 py-5 text-sm text-slate-700 space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>

            {/* زر الاختيار */}
            <div className="px-6 pb-6">
              <Link
                to={
                  plan.id === 2
                    ? `/parent/online-plan/${plan.id}/${studentId}`
                    : 
                      plan.id === 3
                      ? `/parent/online-courses/${plan.id}/${studentId}`
                      : `/parent/offline-courses/${plan.id}/${studentId}`
                }
                className="block w-full text-center rounded-lg bg-orange-400 hover:bg-[#ea580c] text-white py-2.5 px-4 transition-colors font-semibold shadow-sm"
              >
                اختر الخطة
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowPlans;
