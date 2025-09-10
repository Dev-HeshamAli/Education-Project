import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

export default function PricingSection() {
  const [stage, setStage] = useState("primary"); // "primary" أو "kg"

  // تعريف الأسعار لكل خطة حسب المرحلة
  const PRICING = {
    primary: {
      school: { old: 13000, current: 6500, unit: "term" },
      separate: { old: 4000, current: 2000, unit: "للمادة" },
      recorded: { old: 2000, current: 1000, unit: "للمادة" },
    },
    kg: {
      school: { old: 12000, current: 6000, unit: "term" },
      separate: { old: 3400, current: 1700, unit: "للمادة" },
      recorded: { old: 1400, current: 700, unit: "للمادة" },
    },
  };

  // نختار مجموعة الأسعار حسب المرحلة
  const prices = useMemo(() => PRICING[stage], [stage]);

  const DiscountBadge = ({ old, current }) => {
    const pct = Math.round((1 - current / old) * 100);
    return (
      <div className="absolute top-0 left-0 rtl:left-auto rtl:right-0 bg-orange-500 text-white px-4 py-1 rounded-br-lg text-sm shadow">
        خصم {pct}%
      </div>
    );
  };

  const PriceBlock = ({ old, current, unit }) => (
    <div className="text-2xl font-bold text-gray-800 mb-4 flex items-baseline gap-2">
      <del className="text-gray-400 text-sm">{old}</del>
      <span>{current}</span>
      <span className="text-sm text-gray-600">/ {unit} / EGP</span>
    </div>
  );

  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-orange-600 font-bold text-lg">خططنا الدراسية</span>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">اختر الخطة التي تناسبك</h2>
        </div>

        {/* أزرار اختيار المرحلة */}
        <div className="flex justify-center mb-10 space-x-4 rtl:space-x-reverse">
          <button
            onClick={() => setStage("primary")}
            className={`px-6 py-2 rounded-full font-semibold border transition ${
              stage === "primary" ? "bg-orange-600 text-white border-orange-600" : "bg-white text-orange-600 border-orange-600"
            }`}
          >
            المرحلة الإبتدائية
          </button>
          <button
            onClick={() => setStage("kg")}
            className={`px-6 py-2 rounded-full font-semibold border transition ${
              stage === "kg" ? "bg-orange-600 text-white border-orange-600" : "bg-white text-orange-600 border-orange-600"
            }`}
          >
            مرحلة رياض الأطفال
          </button>
        </div>

        {/* الكروت */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Plan 1: الالتحاق بالمدرسة */}
          <div className="bg-gray-50 rounded-lg p-6 shadow text-right relative">
            <DiscountBadge old={prices.school.old} current={prices.school.current} />
            <h3 className="text-xl font-bold text-orange-600 mb-4">التحاق بالمدرسة</h3>
            <PriceBlock {...prices.school} />
            <ul className="list-disc text-sm text-gray-700 space-y-2 pr-4 rtl:pr-0 rtl:pl-4">
              <li>جدول دراسي ثابت (صباحي أو مسائي)</li>
              <li>حصص مباشرة أونلاين مع المعلمين عبر Zoom</li>
              <li>الحصول على الحصة مكتوبة PDF</li>
              <li>دردشة، تلخيص، وترجمة الـPDF باستخدام الذكاء الاصطناعي</li>
              <li>اختبار النطق في اللغة الإنجليزية باستخدام الذكاء الاصطناعي</li>
              <li>أنشطة اجتماعية افتراضية</li>
              <li>أفلام تفاعلية ورسوم متحركة</li>
              <li>متابعة مستوى الطالب بشكل دوري</li>
            </ul>
            <Link to="/login" className="mt-6 block text-center bg-orange-600 text-white py-2 rounded font-semibold">
              اختر الخطة
            </Link>
          </div>

          {/* Plan 2: خطة المواد المنفصلة */}
          <div className="bg-gray-50 rounded-lg p-6 shadow text-right relative">
            <DiscountBadge old={prices.separate.old} current={prices.separate.current} />
            <h3 className="text-xl font-bold text-orange-600 mb-4">خطة المواد المنفصلة</h3>
            <PriceBlock {...prices.separate} />
            <ul className="list-disc text-sm text-gray-700 space-y-2 pr-4 rtl:pr-0 rtl:pl-4">
              <li>اختر مادة واحدة أو أكثر حسب الحاجة</li>
              <li>حصص مباشرة أونلاين مع المعلمين عبر Zoom</li>
              <li>الحصول على الحصة مكتوبة PDF</li>
              <li>دردشة، تلخيص، وترجمة الـPDF باستخدام الذكاء الاصطناعي</li>
              <li>اختبار النطق في اللغة الإنجليزية باستخدام الذكاء الاصطناعي</li>
              <li>أنشطة اجتماعية افتراضية</li>
              <li>أفلام تفاعلية ورسوم متحركة</li>
              <li>متابعة مستوى الطالب بشكل دوري</li>
            </ul>
            <Link to="/login" className="mt-6 block text-center bg-orange-600 text-white py-2 rounded font-semibold">
              اختر الخطة
            </Link>
          </div>

          {/* Plan 3: نظام الحصص المسجلة */}
          <div className="bg-gray-50 rounded-lg p-6 shadow text-right relative">
            <DiscountBadge old={prices.recorded.old} current={prices.recorded.current} />
            <h3 className="text-xl font-bold text-orange-600 mb-4">نظام الحصص المسجلة</h3>
            <PriceBlock {...prices.recorded} />
            <ul className="list-disc text-sm text-gray-700 space-y-2 pr-4 rtl:pr-0 rtl:pl-4">
              <li>فيديوهات مسجلة لجميع المواد</li>
              <li>دردشة، تلخيص، وترجمة الـPDF باستخدام الذكاء الاصطناعي</li>
              <li>اختبار النطق في اللغة الإنجليزية باستخدام الذكاء الاصطناعي</li>
              <li>أفلام تفاعلية ورسوم متحركة</li>
            </ul>
            <Link to="/login" className="mt-6 block text-center bg-orange-600 text-white py-2 rounded font-semibold">
              اختر الخطة
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
