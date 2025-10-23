// src/pages/ContactUs.jsx
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../api/BASE_URL";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

function ContactUs() {
  const token = useSelector((state) => state.auth.token);
  const [problem, setProblem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!problem.trim()) {
      toast.error("من فضلك اكتب مشكلتك قبل الإرسال");
      return;
    }
    const loadingToast = toast.loading("جارٍ إرسال المشكلة...");
    try {
      await axios.post(
        `${BASE_URL}/api/ContactUs/Add-problem`,
        { problem: problem },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      toast.success("تم إرسال المشكلة بنجاح!");
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء الإرسال");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <>
      <div className="flex justify-center bg-gray-100 pt-[100px] px-4" dir="rtl">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-[#0b1a2a] mb-6 text-center">
            تواصل معنا
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            إذا كانت لديك أي مشكلة، من فضلك ضفها في الأسفل وسنقوم بالرد عليك في
            أقرب وقت.
          </p>

          {/* ✅ أرقام التواصل */}
          <div className="mb-6 space-y-3 text-lg text-gray-800">
            <p className="flex items-center gap-2">
              <FaWhatsapp className="text-green-500 text-xl" />
              <span>
                واتساب:{" "}
                <a
                  href="https://wa.me/201021355543"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  01021355543
                </a>
              </span>
            </p>
            <p className="flex items-center gap-2">
              <FaPhoneAlt className="text-blue-500 text-xl" />
              <span>
                اتصال:{" "}
                <a
                  href="tel:01031165004"
                  className="text-blue-600 hover:underline"
                >
                  01031165004
                </a>
              </span>
            </p>
          </div>

          {/* ✅ نموذج إرسال المشكلة */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                مشكلتك:
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                rows="6"
                placeholder="اكتب مشكلتك هنا..."
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-[#0b1a2a] text-white font-semibold px-6 py-2 rounded-lg transition"
              >
                إرسال
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex justify-center mb-5">
        <Link
          to="/parent/problems"
          className="mt-20 bg-[#0b1a2a] text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          عرض المشكلات
        </Link>
      </div>
    </>
  );
}

export default ContactUs;
