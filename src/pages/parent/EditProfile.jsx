// src/pages/parent/EditProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchParentInfo } from "../../store/parent/parentSlice";
import { BASE_URL } from "../../api/BASE_URL";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* helper: حوّل قيمة (string | string[] | undefined) لمصفوفة ستراﭼ */
const toStringArray = (v) => {
  if (Array.isArray(v)) return v.filter(Boolean).map(String);
  if (v == null) return [""];
  return String(v).trim() ? [String(v)] : [""];
};

function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const { id } = useSelector((s) => s.auth);
  const parentInfo = useSelector((s) => s.parent.parentInfo);

  // 👁️‍🗨️ إظهار/إخفاء كلمة المرور
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
  if (token) {
    dispatch(fetchParentInfo(token)); // اسحب دايمًا عند الدخول/تغير التوكن
  }
}, [dispatch, token]);
  // فاليديشن
  const phoneEg = /^01[0125][0-9]{8}$/;
  const waEg = /^01[0125][0-9]{8}$/;

  const validationSchema = Yup.object({
    firstName: Yup.string().required("الاسم الأول مطلوب"),
    secondName: Yup.string().required("الاسم الثاني مطلوب"),
    thirdName: Yup.string().required("الاسم الثالث مطلوب"),
    email: Yup.string().required("البريد الإلكتروني مطلوب").email("صيغة البريد غير صحيحة"),
    password: Yup.string()
      .nullable()
      .transform((v) => (v === "" ? null : v))
      .min(6, "كلمة المرور لا تقل عن 6 أحرف"),
    whatsApp_number: Yup.string()
      .nullable()
      .transform((v) => (v === "" ? null : v))
     ,
    allPhones: Yup.array()
      .of(
        Yup.string()
          .required("الرقم مطلوب")
     
      )
      .min(1, "أضف رقم هاتف واحد على الأقل"),
    jobs: Yup.array().of(
      Yup.object({
        job: Yup.string().required("المسمى الوظيفي مطلوب"),
        gender: Yup.string().oneOf(["Male", "Female"], "اختر النوع").required("النوع مطلوب"),
      })
    ),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: parentInfo?.firstName || "",
      secondName: parentInfo?.secondName || "",
      thirdName: parentInfo?.thirdName || "",
      email: parentInfo?.email || "",
      password: parentInfo?.password || "", 
      whatsApp_number: parentInfo?.whatsApp_number || "",
      allPhones: toStringArray(parentInfo?.allPhones),
      jobs: parentInfo?.jobs?.length ? parentInfo.jobs : [{ job: "", gender: "" }],
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values, { setFieldError }) {
    const loading = toast.loading("جارٍ الحفظ…");
    try {
      // قصّ/تنظيف قبل الإرسال
      const email = (values.email || "").trim();
      const wa    = (values.whatsApp_number || "").trim();
      const pwd   = (values.password || "").trim();

      const payload = {
        id,
        firstName: values.firstName,
        secondName: values.secondName,
        thirdName: values.thirdName,
        email,
        whatsApp_number: wa || null,
        allPhones: values.allPhones.map((p) => String(p || "").trim()).filter(Boolean),
        jobs: values.jobs.map((j) => ({ job: (j.job || "").trim(), gender: (j.gender || "").trim() })),
        ...(pwd ? { password: pwd } : {}), // ابعت الباسورد فقط لو فيه قيمة
      };

      await axios.put(`${BASE_URL}/api/Parent/update-parent`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("تم التحديث بنجاح");
      if (token) dispatch(fetchParentInfo(token));
      navigate("/parent/parent-profile");
    } catch (err) {
      const raw = err?.response?.data;

      // نفس منطق RegisterParent: "email must unique" في errors[]
      const errorsArr = Array.isArray(raw?.errors) ? raw.errors : [];
      const isEmailTaken = errorsArr.some((e) =>
        String(e).toLowerCase().includes("email must unique")
      );
      if (isEmailTaken) {
        setFieldError("email", "هذا البريد مسجّل بالفعل. يرجى إدخال بريد آخر.");
        toast.error("هذا البريد مسجّل بالفعل. يرجى إدخال بريد آخر.");
      } else {
        // عرض أخطاء Password القادمة من السيرفر (ModelState) إن وُجدت
        const pwdErrors =
          raw?.errors?.Password ||
          raw?.errors?.password ||
          (typeof raw?.errors === "object" && raw?.errors?.["Password"]) ||
          null;

        if (Array.isArray(pwdErrors) && pwdErrors.length) {
          setFieldError("password", pwdErrors[0]);
          toast.error(pwdErrors[0]);
        } else {
          const msg =
            raw?.message ||
            raw?.title ||
            Object.values(raw?.errors || {})?.flat()?.[0] ||
            err?.message ||
            "حدث خطأ أثناء التحديث";
          toast.error(msg);
        }
      }

    } finally {
      toast.dismiss(loading);
    }
  }

  const showErr = (name) =>
    formik.touched[name] && formik.errors[name] ? (
      <p className="text-red-700 bg-red-100 border border-red-200 px-3 py-2 rounded-lg mt-1 text-sm">
        {formik.errors[name]}
      </p>
    ) : null;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto max-w-3xl">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white shadow-md rounded-2xl p-6 md:p-8 space-y-6"
        >
          <h1 className="font-bold text-center text-2xl mb-5">تعديل بيانات</h1>

          {/* الأسماء */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">الاسم الأول</label>
              <input
                type="text"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              {showErr("firstName")}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">الاسم الثاني</label>
              <input
                type="text"
                name="secondName"
                value={formik.values.secondName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              {showErr("secondName")}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">الاسم الثالث</label>
              <input
                type="text"
                name="thirdName"
                value={formik.values.thirdName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              {showErr("thirdName")}
            </div>
          </div>

          {/* بريد + واتساب */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              {showErr("email")}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">رقم واتساب</label>
              <input
                type="text"
                name="whatsApp_number"
                value={formik.values.whatsApp_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="01xxxxxxxxx (اختياري)"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
              {showErr("whatsApp_number")}
            </div>
          </div>

          {/* كلمة المرور (اختياري) + 👁️ زر العين */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              كلمة المرور
            </label>

            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-lg border px-3 py-2  text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                onMouseDown={(e) => e.preventDefault()}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
                aria-label={showPwd ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                title={showPwd ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {showErr("password")}
          </div>

          {/* أرقام الهاتف */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">أرقام الهاتف</label>
            {formik.values.allPhones.map((ph, idx) => (
              <div key={idx} className="flex items-start gap-2 mb-2">
                <input
                  type="text"
                  value={ph}
                  onChange={(e) => {
                    const arr = [...formik.values.allPhones];
                    arr[idx] = e.target.value;
                    formik.setFieldValue("allPhones", arr);
                  }}
                  onBlur={() => formik.setFieldTouched(`allPhones[${idx}]`, true)}
                  placeholder="01xxxxxxxxx"
                  className="flex-1 rounded-lg border px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    const arr = formik.values.allPhones.filter((_, i) => i !== idx);
                    formik.setFieldValue("allPhones", arr.length ? arr : [""]);
                  }}
                  className="px-3 py-2 rounded-lg bg-red-500 text-white text-sm"
                >
                  حذف
                </button>
              </div>
            ))}
            {formik.touched.allPhones && typeof formik.errors.allPhones === "string" && (
              <p className="text-red-700 bg-red-100 border border-red-200 px-3 py-2 rounded-lg mt-1 text-sm">
                {formik.errors.allPhones}
              </p>
            )}
            <button
              type="button"
              onClick={() =>
                formik.setFieldValue("allPhones", [...formik.values.allPhones, ""])
              }
              className="mt-2 px-4 py-2 rounded-lg bg-green-500 text-white text-sm"
            >
              + إضافة رقم
            </button>
          </div>

          {/* الوظائف */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الوظائف</label>
            {formik.values.jobs.map((j, idx) => (
              <div key={idx} className="rounded-xl border p-4 mb-3 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">المسمى الوظيفي</label>
                    <input
                      type="text"
                      value={j.job}
                      onChange={(e) => {
                        const arr = [...formik.values.jobs];
                        arr[idx].job = e.target.value;
                        formik.setFieldValue("jobs", arr);
                      }}
                      className="w-full rounded-lg border px-3 py-2 text-sm"
                      placeholder="مثال: مُدرّس / مهندس"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">النوع</label>
                    <select
                      value={j.gender}
                      onChange={(e) => {
                        const arr = [...formik.values.jobs];
                        arr[idx].gender = e.target.value;
                        formik.setFieldValue("jobs", arr);
                      }}
                      className="w-full rounded-lg border px-3 py-2 text-sm"
                    >
                      <option value="">اختر</option>
                      <option value="Male">ذكر</option>
                      <option value="Female">أنثى</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      const arr = formik.values.jobs.filter((_, i) => i !== idx);
                      formik.setFieldValue(
                        "jobs",
                        arr.length ? arr : [{ job: "", gender: "" }]
                      );
                    }}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm"
                  >
                    حذف الوظيفة
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                formik.setFieldValue("jobs", [
                  ...formik.values.jobs,
                  { job: "", gender: "" },
                ])
              }
              className="mt-2 px-4 py-2 rounded-lg bg-green-500 text-white text-sm"
            >
              + إضافة وظيفة
            </button>
          </div>

          {/* الأزرار */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 transition duration-200 bg-slate-800 hover:bg-slate-900 text-white w-full py-2.5 rounded-lg text-sm font-semibold"
            >
            تحديث البيانات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
