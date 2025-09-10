// src/pages/parent/RegisterParent.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Navbar from "../../components/main/Navbar";

function RegisterParent() {
  const navigate = useNavigate();

  // ريجكس
  const passReg = /^[A-Z][A-Za-z0-9]{5,}$/;
  const phoneReg = /^01[0125][0-9]{8}$/;

  // لود/داتا الدول
  const [countries, setCountries] = useState([]); // [{code, nameAr, nameEn}]
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesErr, setCountriesErr] = useState("");

  useEffect(() => {
    let alive = true;
    async function loadCountries() {
      try {
        setCountriesLoading(true);
        setCountriesErr("");
        // بنجيب الاسم العربي إن وُجد + الاسم الرسمي الإنجليزي
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,translations"
        );
        const raw = await res.json();

        const mapped = (Array.isArray(raw) ? raw : [])
          .map((c) => {
            const nameAr = c?.translations?.ara?.common || c?.name?.common || "";
            const nameEn = c?.name?.official || c?.name?.common || "";
            return {
              code: c?.cca2 || c?.cca3 || nameEn,
              nameAr,
              nameEn,
            };
          })
          // ترتيب أبجدي عربي ثم إنجليزي كاحتياطي
          .sort((a, b) =>
            (a.nameAr || a.nameEn).localeCompare(b.nameAr || b.nameEn, "ar")
          );

        if (!alive) return;
        setCountries(mapped);

        // لو المستخدم ما اختارش دولة لسه، نعيّن مصر بشكل افتراضي إن وُجدت
        const egypt =
          mapped.find((x) => x.code === "EG" || /Egypt/i.test(x.nameEn) || x.nameAr === "مصر") ||
          mapped[0];

        if (!formik.values.country && egypt) {
          formik.setFieldValue("country", egypt.nameEn); // نرسل official EN للباك-إند
        }
      } catch (e) {
        if (!alive) return;
        setCountriesErr("تعذّر تحميل قائمة الدول. يمكنك إدخال الدولة يدويًا.");
      } finally {
        if (!alive) return;
        setCountriesLoading(false);
      }
    }
    loadCountries();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Yup
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("الاسم الأول مطلوب")
      .min(3, "يجب أن لا يقل الاسم الأول عن 3 أحرف")
      .max(20, "يجب أن لا يزيد الاسم الأول عن 20 حرفًا"),
    secondName: Yup.string()
      .required("الاسم الثاني مطلوب")
      .min(3, "يجب أن لا يقل الاسم الثاني عن 3 أحرف")
      .max(20, "يجب أن لا يزيد الاسم الثاني عن 20 حرفًا"),
    thirdName: Yup.string().nullable(),
    ssn: Yup.string()
      .required("الرقم القومي مطلوب")
      .matches(/^\d{14}$/, "الرقم القومي يجب أن يكون 14 رقمًا"),
    country: Yup.string().required("الدولة مطلوبة"),
    governorate: Yup.string().required("المحافظة مطلوبة"),
    email: Yup.string()
      .required("البريد الإلكتروني مطلوب")
      .email("صيغة البريد الإلكتروني غير صحيحة"),
    password: Yup.string()
      .required("كلمة المرور مطلوبة")
      .matches(
        passReg,
        "يجب أن تبدأ بحرف كبير وتكون 6 أحرف/أرقام على الأقل"
      ),
    whatsApp_number: Yup.string()
      .required("رقم واتساب مطلوب")
      .matches(phoneReg, "رقم واتساب غير صالح"),
    allPhones: Yup.array()
      .of(
        Yup.string()
          .matches(phoneReg, "رقم الهاتف غير صالح")
          .required("رقم الهاتف مطلوب")
      )
      .min(1, "يجب إضافة رقم هاتف واحد على الأقل"),
    jobs: Yup.array().of(
      Yup.object({
        job: Yup.string().required("المسمى الوظيفي مطلوب"),
        gender: Yup.string()
          .oneOf(["Male", "Female"], "اختر النوع")
          .required("النوع مطلوب"),
      })
    ),
  });

  // الحقول المطلوبة لإظهار النجمة
  const requiredFields = new Set([
    "firstName",
    "secondName",
    "ssn",
    "country",
    "governorate",
    "email",
    "password",
    "whatsApp_number",
    "allPhones", // المجموعة كلها مطلوبة
    "jobs.job",
    "jobs.gender",
  ]);

  const Label = ({ children, required }) => (
    <label className="mb-1 text-sm font-semibold text-slate-700">
      {children} {required && <span className="text-rose-500">*</span>}
    </label>
  );

  const formik = useFormik({
    initialValues: {
      firstName: "",
      secondName: "",
      thirdName: "",
      ssn: "",
      country: "",
      governorate: "",
      email: "",
      password: "",
      whatsApp_number: "",
      allPhones: [""],
      jobs: [{ job: "", gender: "" }],
    },
    validationSchema,
    onSubmit: (values) => {
      sendDataToSignUp(values);
    },
  });

  async function sendDataToSignUp(values) {
    const loadingToast = toast.loading("جارٍ التحميل...");
    try {
      const res = await axios.post(
        `https://edu-smart.runasp.net/api/Parent/create-parent`,
        values,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(res);
      toast.success("تم إنشاء الحساب بنجاح!");
      navigate("/parent");
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "حدث خطأ غير متوقع");
    } finally {
      toast.dismiss(loadingToast);
    }
  }

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
                إنشاء حساب ولي الأمر
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

                {/* الرقم القومي */}
                <div className="flex flex-col">
                  <Label required={requiredFields.has("ssn")}>الرقم القومي</Label>
                  <input
                    type="text"
                    name="ssn"
                    value={formik.values.ssn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    placeholder="أدخل الرقم القومي (14 رقمًا)"
                  />
                  <FieldError name="ssn" />
                </div>

                {/* الدولة (قائمة من API) */}
                <div className="flex flex-col">
                  <Label required={requiredFields.has("country")}>الدولة</Label>

                  {countriesLoading ? (
                    <div className="h-11 rounded-xl bg-gray-100 animate-pulse" />
                  ) : countriesErr ? (
                    <>
                      <input
                        type="text"
                        name="country"
                        value={formik.values.country}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                        placeholder="ادخل الدولة يدويًا"
                      />
                      <p className="text-xs mt-1 text-amber-600">{countriesErr}</p>
                    </>
                  ) : (
                    <select
                      name="country"
                      value={formik.values.country}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white"
                    >
                      {countries.map((c) => (
                        <option key={c.code} value={c.nameEn}>
                          {c.nameAr || c.nameEn}
                        </option>
                      ))}
                    </select>
                  )}
                  <FieldError name="country" />
                </div>

                {/* المحافظة */}
                <div className="flex flex-col">
                  <Label required={requiredFields.has("governorate")}>
                    المحافظة
                  </Label>
                  <input
                    type="text"
                    name="governorate"
                    value={formik.values.governorate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    placeholder="ادخل المحافظة"
                  />
                  <FieldError name="governorate" />
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

                {/* كلمة المرور */}
                <div className="flex flex-col">
                  <Label required={requiredFields.has("password")}>
                    كلمة المرور
                  </Label>
                  <input
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    placeholder="ابدأ بحرف كبير (A...)"
                  />
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
                    placeholder="01XXXXXXXXX"
                  />
                  <FieldError name="whatsApp_number" />
                </div>

                {/* divider */}
                <div className="md:col-span-2 my-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </div>

                {/* أرقام الهاتف */}
                <div className="md:col-span-2">
                  <Label required={requiredFields.has("allPhones")}>أرقام الهاتف</Label>
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
                <div className="md:col-span-2">
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
              حقوق النشر © 2024 Edu-Smart. جميع الحقوق محفوظة بواسطة{" "}
              <a
                href="https://envytheme.com/"
                target="_blank"
                rel="noopener noreferrer"
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
