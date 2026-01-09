/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsWhatsapp, BsTelephone } from "react-icons/bs";

export default function PricingSectionPrep() {
  const [open, setOpen] = useState(false); // لقائمة "تواصل معنا"
  const [stage, setStage] = useState("primary"); // "primary" أو "kg"
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const Call = () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="relative mt-6 block text-center bg-orange-600 text-white py-2 rounded font-semibold ">
        <button
          onClick={() => setOpen((v) => !v)}
          className="px-4 flex items-center gap-1 m-auto w-full justify-center"
        >
          Contact Us
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {open && (
          <ul
            dir="ltr"
            className="absolute left-0 mt-2 w-full bg-white rounded-md shadow-lg z-50 border "
          >
            <li>
              <a
                href="https://wa.me/201021355543"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 text-base hover:bg-gray-100 text-gray-700 font-medium"
              >
                <BsWhatsapp className="inline mr-2 text-green-600 text-lg" />
                WhatsApp :+201021355543
              </a>
            </li>
            <li>
              <a
                href="tel:+201031165004"
                className="block px-4 py-3 text-base hover:bg-gray-100 text-gray-700 font-medium"
              >
                <BsTelephone className="inline mr-2 text-blue-600 text-lg" />
                Call :+201031165004
              </a>
            </li>
          </ul>
        )}
      </div>
    );
  };

  // const baseLink = "px-1 hover:text-orange-600 transition-colors";

  // تعريف الأسعار لكل خطة حسب المرحلة
  // const PRICING = {
  //   primary: {
  //     school: { old: 13000, current: 6500, unit: "term" },
  //     separate: { old: 4000, current: 2000, unit: "term" },
  //     recorded: { old: 2000, current: 1000, unit: "term" },
  //   },
  //   kg: {
  //     school: { old: 12000, current: 6000, unit: "term" },
  //     separate: { old: 3400, current: 1700, unit: "term" },
  //     recorded: { old: 1400, current: 700, unit: "term" },
  //   },
  // };

  // نختار مجموعة الأسعار حسب المرحلة
  // const prices = useMemo(() => PRICING[stage], [stage]);

  // const DiscountBadge = ({ old, current }) => {
  //   const pct = Math.round((1 - current / old) * 100);
  //   return (
  //     <div className="absolute top-0 left-0 rtl:left-auto rtl:right-0 bg-orange-500 text-white px-4 py-1 rounded-br-lg text-sm shadow">
  //       خصم {pct}%
  //     </div>
  //   );
  // };

  // const PriceBlock = ({ old, current, unit }) => (
  //   <div className="text-2xl font-bold text-gray-800 mb-4 flex items-baseline gap-2">
  //     <del className="text-gray-400 text-sm">{old}</del>
  //     <span>{current}</span>
  //     <span className="text-sm text-gray-600">/ {unit} / EGP</span>
  //   </div>
  // );

  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-orange-600 font-bold text-4xl">
            Our Study Plans
          </h1>
          {/* <h2 className="text-3xl font-bold text-gray-800 mt-2">
            اختر الخطة التي تناسبك
          </h2> */}
        </div>

        {/* أزرار اختيار المرحلة */}
        {/* <div className="flex justify-center mb-10 space-x-4 rtl:space-x-reverse">
          <button
            onClick={() => setStage("primary")}
            className={`px-6 py-2 rounded-full font-semibold border transition ${
              stage === "primary"
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white text-orange-600 border-orange-600"
            }`}
          >
            المرحلة الإبتدائية
          </button>
          <button
            onClick={() => setStage("kg")}
            className={`px-6 py-2 rounded-full font-semibold border transition ${
              stage === "kg"
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white text-orange-600 border-orange-600"
            }`}
          >
            مرحلة رياض الأطفال
          </button>
        </div> */}

        {/* الكروت */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Plan 1: الالتحاق بالمدرسة */}
          <div className="bg-gray-50 rounded-lg p-6 shadow text-right relative">
            {/* <DiscountBadge old={prices.school.old} current={prices.school.current} /> */}
            <h3 className="text-2xl font-bold text-orange-600 mb-6 text-center">
              School Enrollment
            </h3>

            {/* <PriceBlock {...prices.school} /> */}
            <ul className="text-sm text-gray-700 space-y-2 pr-4 ltr:pr-0 ltr:pl-4 text-left">
              <li>Fixed study schedule (morning or evening) •</li>
              <li>Live online classes with teachers via Zoom •</li>
              <li>Receive the lesson as a written PDF •</li>
              <li>Chat, summarize, and translate PDFs using AI •</li>
              <li>English pronunciation test powered by AI •</li>
              <li>Virtual social activities •</li>
              <li>Interactive movies and animations •</li>
              <li>Continuous student performance tracking •</li>
            </ul>

            <Call />
            {/* <Link
              to="/login"
              className="mt-6 block text-center bg-orange-600 text-white py-2 rounded font-semibold"
            >
              اختر الخطة
            </Link> */}
          </div>

          {/* Plan 2: خطة المواد المنفصلة */}
          <div className="bg-gray-50 rounded-lg p-6 shadow text-right relative">
            {/* <DiscountBadge old={prices.separate.old} current={prices.separate.current} /> */}
            <h3 className="text-2xl font-bold text-orange-600 mb-6 text-center">
              Individual Subjects Plan
            </h3>

            {/* <PriceBlock {...prices.separate} /> */}
            <ul className=" text-sm text-gray-700 space-y-2 pr-4 rtl:pr-0 rtl:pl-4 text-left">
              <li>Choose one or more subjects as needed •</li>
              <li>Live online classes with teachers via Zoom •</li>
              <li>Receive the lesson as a written PDF •</li>
              <li>Chat, summarize, and translate PDFs using AI •</li>
              <li>English pronunciation test powered by AI •</li>
              <li>Virtual social activities •</li>
              <li>Interactive movies and animations •</li>
              <li>Continuous student performance tracking •</li>
            </ul>
            <Call />
            {/* <Link •
              to="/login"
              className="mt-6 block text-center bg-orange-600 text-white py-2 rounded font-semibold"
            >
              اختر الخطة
            </Link> */}
          </div>

          {/* Plan 3: نظام الحصص المسجلة */}
          <div className="bg-gray-50 rounded-lg p-6 shadow text-right relative flex flex-col">
            {/* <DiscountBadge old={prices.recorded.old} current={prices.recorded.current} /> */}
            <h3 className="text-2xl font-bold text-orange-600 mb-6 text-center">
              Recorded Classes System
            </h3>

            {/* <PriceBlock {...prices.recorded} /> */}
            <ul className=" text-sm text-gray-700 space-y-2 pr-4 rtl:pr-0 rtl:pl-4 text-left">
              <li>Recorded videos for all subjects •</li>
              <li>Chat, summarize, and translate PDFs using AI •</li>
              <li>English pronunciation test powered by AI •</li>
              <li>Interactive movies and animations •</li>
            </ul>
            <div className="mt-auto">
              <Call />
            </div>
            {/* <Link
              to="/login"
              className="mt-6 block text-center bg-orange-600 text-white py-2 rounded font-semibold"
            >
              اختر الخطة
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
}
