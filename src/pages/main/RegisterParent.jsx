// src/pages/parent/RegisterParent.jsx
import axios from "axios";
import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { BASE_URL } from "../../api/BASE_URL";
import Navbar from "../../components/main/Navbar";

function RegisterParent() {
  const navigate = useNavigate();

  // Regex
  const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // 8+ ويحتوي Lowercase + Uppercase + Digit
  const phoneReg = /^01[0125][0-9]{8}$/; // رقم مصري كمثال

  // show/hide password
  const [showPass, setShowPass] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      secondName: "",
      thirdName: "",
      email: "",
      password: "",
      whatsApp_number: "",
      allPhones: [""],
      jobs: [{ job: "", gender: "" }],
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required("الاسم الأول مطلوب")
        .min(2, "يجب أن لا يقل الاسم الأول عن 2 حرف")
        .max(30, "يجب أن لا يزيد الاسم الأول عن 30 حرف"),
      secondName: Yup.string()
        .required("الاسم الثاني مطلوب")
        .min(2, "يجب أن لا يقل الاسم الثاني عن 2 حرف")
        .max(30, "يجب أن لا يزيد الاسم الثاني عن 30 حرف"),
      thirdName: Yup.string().nullable(),
      email: Yup.string()
        .required("البريد الإلكتروني مطلوب")
        .email("صيغة البريد الإلكتروني غير صحيحة"),
      password: Yup.string()
        .required("كلمة المرور مطلوبة")
        .matches(
          passReg,
          "يجب أن تتكون كلمة المرور من 8 رموز على الأقل وتحتوي على حرف كبير وحرف صغير ورقم"
        ),
      whatsApp_number: Yup.string()
        .required("رقم واتساب مطلوب")
        .matches(phoneReg, "تاكد من رقم الواتساب"),
      allPhones: Yup.array()
        .of(
          Yup.string()
            .trim()
            .required("رقم الهاتف مطلوب")
            .matches(phoneReg, "تاكد من رقم الهاتف")
        )
        .min(1, "يجب إضافة رقم هاتف واحد على الأقل"),
      // .matches(phoneReg, "تاكد من رقم الهاتف"),
      jobs: Yup.array()
        .of(
          Yup.object({
            job: Yup.string().default("غير معروف"),
            gender: Yup.string()
              .oneOf(["Male", "Female"], "اختر النوع")
              .required("النوع مطلوب"),
          })
        )
        .min(1, "يجب اختيار النوع"),
    }),
    onSubmit: (values) => {
      sendDataToSignUp(values);
    },
  });

  function preparePayload(v) {
    // تنظيف قبل الإرسال: إزالة العناصر الفارغة/المسافات
    const phones = (v.allPhones || [])
      .map((p) => String(p || "").trim())
      .filter(Boolean);

    const jobs = (v.jobs || [])
      .map((j) => ({
        job: String(j?.job || "غير معروف").trim() || "غير معروف",
        gender: String(j?.gender || "").trim(),
      }))
      .filter((j) => j.gender); // النوع فقط هو الإجباري

    return {
      firstName: v.firstName.trim(),
      secondName: v.secondName.trim(),
      thirdName: (v.thirdName || "").trim(),
      email: v.email.trim(),
      password: v.password,
      whatsApp_number: v.whatsApp_number.trim(),
      allPhones: phones.length ? phones : [""], // يطابق النوع المتوقع
      jobs: jobs.length ? jobs : [{ job: "", gender: "" }],
    };
  }

  async function sendDataToSignUp(values) {
    const payload = preparePayload(values);
    const loadingToast = toast.loading("جارٍ التحميل...");
    try {
      await axios.post(`${BASE_URL}/api/Parent/create-parent`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("تم إنشاء الحساب بنجاح!");
      navigate("/login");
    } catch (err) {
      const raw = err?.response?.data;
      const errorsArr = Array.isArray(raw?.errors) ? raw.errors : [];

      // رسالة تكرار الإيميل (حسب رسائل الباك الحالية)
      const isEmailTaken = errorsArr.some((e) =>
        String(e).toLowerCase().includes("email must unique")
      );

      if (isEmailTaken) {
        formik.setFieldError(
          "email",
          "هذا البريد مسجّل بالفعل. يرجى إدخال بريد آخر."
        );
        toast.error("هذا البريد مسجّل بالفعل. يرجى إدخال بريد آخر.");
      } else {
        toast.error(
          raw?.message || raw?.title || err?.message || "حدث خطأ غير متوقع"
        );
      }
    } finally {
      toast.dismiss(loadingToast);
    }
  }

  const requiredFields = new Set([
    "firstName",
    "secondName",
    "email",
    "password",
    "whatsApp_number",
    "allPhones",
    "jobs.job",
    "jobs.gender",
  ]);

  const Label = ({ children, required }) => (
    <label className="mb-1 text-sm font-semibold text-slate-700">
      {children} {required && <span className="text-rose-500">*</span>}
    </label>
  );

  const FieldError = ({ name }) =>
    formik.errors[name] && formik.touched[name] ? (
      <p className="text-xs mt-1 px-3 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200">
        {formik.errors[name]}
      </p>
    ) : null;

  return (
    <>
      <Navbar />
      <div
        dir="rtl"
        className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-50 via-indigo-50 to-white flex items-center justify-center py-12 px-4"
      >
        <div className="w-full max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.12)] bg-white">
            <div className="px-8 pt-8 pb-4 text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
                إنشاء حساب ولي الأمر أولاً
              </h1>
              <p className="mt-2 text-slate-500">
                من فضلك أدخل البيانات التالية بدقة لإتمام عملية التسجيل
              </p>
            </div>

            <div className="px-6 md:px-10 pb-10">
              <form
                onSubmit={formik.handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {/* الاسم الأول */}
                <div className="flex flex-col">
                  <Label required={requiredFields.has("firstName")}>
                    الاسم الأول
                  </Label>
                  <input
                    type="text"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    placeholder="ادخل الاسم الأول"
                  />
                  <FieldError name="firstName" />
                </div>

                {/* الاسم الثاني */}
                <div className="flex flex-col">
                  <Label required={requiredFields.has("secondName")}>
                    الاسم الثاني
                  </Label>
                  <input
                    type="text"
                    name="secondName"
                    value={formik.values.secondName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    placeholder="ادخل الاسم الثاني"
                  />
                  <FieldError name="secondName" />
                </div>

                {/* الاسم الثالث (اختياري) */}
                <div className="flex flex-col">
                  <Label>الاسم الثالث</Label>
                  <input
                    type="text"
                    name="thirdName"
                    value={formik.values.thirdName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    placeholder="ادخل الاسم الثالث"
                  />
                </div>

                {/* البريد */}
                <div className="flex flex-col">
                  <Label required={requiredFields.has("email")}>
                    البريد الإلكتروني
                  </Label>
                  <input
                    type="text"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    placeholder="example@email.com"
                  />
                  <FieldError name="email" />
                </div>

                {/* كلمة المرور + زر إظهار/إخفاء */}
                <div className="flex flex-col">
                  <Label required={requiredFields.has("password")}>
                    كلمة المرور
                  </Label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full rounded-xl border border-slate-200 pr-4 pl-10 py-3 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      onMouseDown={(e) => e.preventDefault()}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      aria-label={
                        showPass ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                      }
                      title={
                        showPass ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                      }
                    >
                      {showPass ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <FieldError name="password" />
                </div>

                {/* رقم واتساب */}
                <div className="flex flex-col">
                  <Label required={requiredFields.has("whatsApp_number")}>
                    رقم واتساب
                  </Label>
                  <input
                    type="text"
                    name="whatsApp_number"
                    value={formik.values.whatsApp_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                  />
                  <FieldError name="whatsApp_number" />
                </div>

                {/* divider */}
                <div className="md:col-span-2 my-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </div>

                {/* أرقام الهاتف */}
                <div className="md:col-span-2">
                  <Label required={requiredFields.has("allPhones")}>
                    أرقام الهاتف
                  </Label>
                  {formik.values.allPhones.map((phone, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        name={`allPhones[${index}]`}
                        value={phone}
                        onChange={(e) => {
                          const allPhones = [...formik.values.allPhones];
                          allPhones[index] = e.target.value;
                          formik.setFieldValue("allPhones", allPhones);
                        }}
                        className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm"
                        placeholder="ادخل رقم الهاتف"
                      />
                      <FieldError name="allPhones" />
                      <button
                        type="button"
                        onClick={() => {
                          const allPhones = formik.values.allPhones.filter(
                            (_, i) => i !== index
                          );
                          formik.setFieldValue("allPhones", allPhones);
                        }}
                        className="shrink-0 rounded-xl bg-rose-500 text-white px-3 py-2 text-sm hover:bg-rose-600"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      formik.setFieldValue("allPhones", [
                        ...formik.values.allPhones,
                        "",
                      ])
                    }
                    className="mt-1 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500  text-white px-4 py-2 text-sm font-bold"
                  >
                    + إضافة رقم
                  </button>
                </div>

                {/* الوظائف */}
                {/* <div className="md:col-span-2">
                  <Label>الوظائف</Label>
                  {formik.values.jobs.map((jobObj, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-white/70 p-4 mb-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label required={requiredFields.has("jobs.job")}>
                            المسمى الوظيفي
                          </Label>
                          <input
                            type="text"
                            value={jobObj.job}
                            onChange={(e) => {
                              const jobs = [...formik.values.jobs];
                              jobs[index].job = e.target.value;
                              formik.setFieldValue("jobs", jobs);
                            }}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                            placeholder="ادخل المسمى الوظيفي"
                          />
                        </div>
                        <div>
                          <Label required={requiredFields.has("jobs.gender")}>
                            النوع
                          </Label>
                          <select
                            value={jobObj.gender}
                            onChange={(e) => {
                              const jobs = [...formik.values.jobs];
                              jobs[index].gender = e.target.value;
                              formik.setFieldValue("jobs", jobs);
                            }}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white"
                          >
                            <option value="">اختر</option>
                            <option value="Male">ذكر</option>
                            <option value="Female">أنثى</option>
                          </select>
                        </div>
                        <FieldError name="jobs.genders" />
                      </div>
                      <div className="mt-3 text-left">
                        <button
                          type="button"
                          onClick={() => {
                            const jobs = formik.values.jobs.filter(
                              (_, i) => i !== index
                            );
                            formik.setFieldValue("jobs", jobs);
                          }}
                          className="rounded-xl bg-rose-500 text-white px-4 py-2 text-sm font-bold hover:bg-rose-600"
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
                    className="mt-1 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-4 py-2 text-sm font-bold"
                  >
                    + إضافة وظيفة
                  </button>
                </div> */}
                {/* الوظائف */}
                <div className="md:col-span-2">
                  {/* <Label>الوظائف</Label> */}

                  {/* حقل النوع */}
                  <div className="mb-4">
                    <Label required={true}>النوع</Label>
                    <select
                      name="gender"
                      value={formik.values.jobs[0]?.gender || ""}
                      onChange={(e) => {
                        const jobs = [...formik.values.jobs];
                        // لو مفيش عنصر بنضيف واحد
                        if (jobs.length === 0)
                          jobs.push({ job: "", gender: "" });
                        jobs[0].gender = e.target.value;
                        formik.setFieldValue("jobs", jobs);
                      }}
                      onBlur={formik.handleBlur}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white"
                    >
                      <option value="">اختر النوع</option>
                      <option value="Male">ذكر</option>
                      <option value="Female">أنثى</option>
                    </select>
                    {formik.touched.jobs && formik.errors.jobs && (
                      <p className="text-xs mt-1 px-3 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200">
                        {formik.errors.jobs[0]?.gender ||
                          (typeof formik.errors.jobs === "string"
                            ? formik.errors.jobs
                            : "")}
                      </p>
                    )}
                  </div>

                  {/* حقل المسمى الوظيفي */}
                  <div>
                    <Label>المسمى الوظيفي</Label>
                    <input
                      type="text"
                      name="job"
                      value={formik.values.jobs[0]?.job || ""}
                      onChange={(e) => {
                        const jobs = [...formik.values.jobs];
                        if (jobs.length === 0)
                          jobs.push({ job: "", gender: "" });
                        jobs[0].job = e.target.value;
                        formik.setFieldValue("jobs", jobs);
                      }}
                      onBlur={formik.handleBlur}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                      placeholder="ادخل المسمى الوظيفي (اختياري)"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="md:col-span-2 mt-2">
                  <button
                    type="submit"
                    className="relative w-full rounded-2xl bg-orange-400 text-white font-extrabold py-3 text-base tracking-wide"
                  >
                    إنشاء حساب
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 py-4 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-200">
            <p>
              حقوق النشر © 2025 Edu-Smart. جميع الحقوق محفوظة بواسطة{" "}
              <a
                href="https://edu-smart.ai"
                className="text-orange-600 hover:underline"
              >
                Edu-Smart.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterParent;
