// src/components/parent/ChildCard.jsx
import { useNavigate } from "react-router-dom";

export default function Child({ item }) {
  const navigate = useNavigate();

  const name   = item?.name || "بدون اسم";
  const stage  = item?.stage || "مرحلة غير محدّدة";
  const level  = item?.study_Level || "صف غير محدّد";
  const status = item?.status; // إن وجدت
  const img    = item?.photo || "/child3.png";

  // تقدير نقاط الألوان: لو عندك خصائص حقيقية بدّلي المنطق
  const dots = [
    item?.stage ? "#0ea5e9" : "#94a3b8",   // أزرق = عنده مرحلة
    item?.study_Level ? "#22c55e" : "#94a3b8", // أخضر = عنده صف
    status ? "#f97316" : "#94a3b8",        // برتقالي = له حالة
  ];

  return (
    <article dir="rtl" className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3">
      <div className="h-full rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        {/* صورة */}
        <div className="bg-[#f1f2f4] relative">
          <img
            src={img}
            alt={name}
            className="mx-auto h-36 w-full max-w-[220px] object-contain"
          />
          {/* شارة صغيرة في الركن (اختياري: حالة) */}
          {status && (
            <span className="absolute right-2 top-2 rounded-md bg-white/90 px-2 py-1 text-[11px] font-semibold text-slate-700 border border-neutral-200">
              {status}
            </span>
          )}
        </div>

        {/* المحتوى */}
        <div className="p-4">
          {/* الاسم */}
          <h4 className="text-[15px] font-extrabold leading-5 text-slate-900 line-clamp-2">
            {name}
          </h4>

          {/* سطر برتقالي (بديل السعر) */}
          <div className="mt-1.5 text-[14px] font-extrabold text-[#f97316]">
            {stage} — {level}
          </div>


          {/* أزرار */}
          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={() => navigate(`/parent/child/${item.id}`)}
              className="w-full rounded-lg bg-slate-800 text-white text-[13px] font-semibold py-2.5 hover:bg-black transition-colors"
            >
              تفاصيل الطالب
            </button>

            <button
              type="button"
              onClick={() => navigate(`/parent/plans/${item.id}`)}
              className="w-full rounded-lg border border-neutral-300 bg-white text-[13px] font-semibold py-2.5 hover:bg-neutral-50"
            >
              اختيار خطة
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
