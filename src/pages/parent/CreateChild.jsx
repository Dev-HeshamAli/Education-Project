import { useFormik } from "formik";
import { useEffect, useState } from "react"; // ✅ احتجنا useState
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { getSemesters, getStages, getStudyLevels } from "../../store/SharedData/SharedDataSlice";
import { createStudent } from "../../store/student/studentSlice";
import { Eye, EyeClosed } from "lucide-react";

function CreateChild() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const { id } = useSelector((state) => state.auth);
  const stages = useSelector((state) => state.shared.stages) || [];
  const studyLevels = useSelector((state) => state.shared.studyLevels) || [];
  const semesters = useSelector((state) => state.shared.semesters) || [];
  const [showPwd, setShowPwd] = useState(false);


  useEffect(() => {
    dispatch(getStages());
    dispatch(getStudyLevels());
    dispatch(getSemesters());
  }, [dispatch]);

  // ✅ دول زي صفحة الأب
  const [countries, setCountries] = useState([]); // [{code, nameAr, nameEn}]
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesErr, setCountriesErr] = useState("");

  useEffect(() => {
    let alive = true;
    async function loadCountries() {
      try {
        setCountriesLoading(true);
        setCountriesErr("");
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,cca3,translations");
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
          .sort((a, b) => (a.nameAr || a.nameEn).localeCompare(b.nameAr || b.nameEn, "ar"));

        if (!alive) return;
        setCountries(mapped);

        // اضبطي مصر كافتراضي لو مفيش قيمة
        const egypt =
          mapped.find((x) => x.code === "EG" || /Egypt/i.test(x.nameEn) || x.nameAr === "مصر") || mapped[0];

        if (!formik.values.country && egypt) {
          formik.setFieldValue("country", egypt.nameEn); // نرسل EN رسمي للباك
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

  // ريجكس مصري زي صفحة البيرنت
  const phoneReg = /^01[0125][0-9]{8}$/;

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("الاسم الأول مطلوب")
      .min(3, "الاسم الأول يجب أن يكون 3 أحرف على الأقل")
      .max(20, "الاسم الأول يجب أن يكون 20 حرفًا بحد أقصى"),
    birthDate: Yup.date().required("تاريخ الميلاد مطلوب"),
    gender: Yup.string()
      .oneOf(["Male", "Female"], "النوع يجب أن يكون ذكر أو أنثى")
      .required("النوع مطلوب"),
    country: Yup.string().required("الدولة مطلوبة"),
    governorate: Yup.string().required("المحافظة مطلوبة"),
    photoPath: Yup.mixed().required("الصورة الشخصية مطلوبة"),
    lastEducationalQualifications: Yup.mixed().required("ملف المؤهل الدراسي مطلوب"),
    ssn: Yup.string().required("الرقم القومي مطلوب").matches(/^\d{14}$/, "الرقم القومي يجب أن يتكون من 14 رقم"),
    email: Yup.string().required("البريد الإلكتروني مطلوب").email("صيغة البريد الإلكتروني غير صحيحة"),
    password: Yup.string()
      .required("كلمة المرور مطلوبة")
      .matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, "كلمة المرور يجب أن تحتوي على حرف كبير ورقم وأن تكون 8 أحرف على الأقل"),
    phoneNumber: Yup.string().required("رقم الهاتف مطلوب").matches(phoneReg, "رقم الهاتف يجب أن يكون رقم مصري صحيح"),
    stageId: Yup.string().required("المرحلة الدراسية مطلوبة"),
    studyLevelId: Yup.string().required("الصف الدراسي مطلوب"),
    semesterId: Yup.string().required("الترم الدراسي مطلوب"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      birthDate: "",
      gender: "",
      country: "", // ✅ هيمتلي تلقائيًا بمصر لو متاحة
      governorate: "",
      photoPath: null,
      lastEducationalQualifications: null,
      ssn: "",
      email: "",
      password: "",
      phoneNumber: "",
      stageId: "",
      studyLevelId: "",
      semesterId: "",
      parentId: id ?? "",
    },
    onSubmit: (x) => addStudent(x),
    validationSchema,
  });

  async function addStudent(values) {
    const loadingToast = toast.loading("جارٍ إنشاء الحساب...");
    try {
      const formData = new FormData();
      formData.append("FirstName", values.firstName);
      formData.append("BirthDate", values.birthDate);
      formData.append("Governorate", values.governorate);
      formData.append("Gender", values.gender);
      formData.append("Country", values.country); // ✅ من الـselect
      formData.append("SSN", values.ssn);
      formData.append("Email", values.email);
      formData.append("Password", values.password);
      formData.append("Phone_Number", values.phoneNumber);
      formData.append("StageId", values.stageId);
      formData.append("StudyLevelId", values.studyLevelId);
      formData.append("semesterId", values.semesterId);
      formData.append("ParentId", values.parentId);
      formData.append("PhotoPath", values.photoPath);
      formData.append("Last_educational_qualifications", values.lastEducationalQualifications);

      await dispatch(createStudent({ formData, token }));
      toast.success("تم إنشاء حساب الطالب بنجاح!");
      navigate("/parent"); // اختياري
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

  const Star = () => <span className="text-red-500">*</span>;

  return (
    <>
      <div
        dir="rtl"
        className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-50 via-indigo-50 to-white flex items-center justify-center py-12 px-4"
      >
        <div className="w-full max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.12)] bg-white">
            {/* Header */}
            <div className="px-8 pt-8 pb-4 text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
                إنشاء حساب الطالب
              </h1>
              <p className="mt-2 text-slate-500">من فضلك أدخل البيانات التالية بدقة لإتمام عملية التسجيل</p>
            </div>

            {/* Form */}
            <div className="px-6 md:px-10 pb-10">
              <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* الاسم الأول */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-slate-700">
                    الاسم الأول <Star />
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none shadow-sm"
                    placeholder="ادخل الاسم الأول"
                  />
                  <FieldError name="firstName" />
                </div>

                {/* الرقم القومي */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-slate-700">
                    الرقم القومي <Star />
                  </label>
                  <input
                    type="text"
                    name="ssn"
                    value={formik.values.ssn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none shadow-sm"
                    placeholder="أدخل الرقم القومي (14 رقمًا)"
                  />
                  <FieldError name="ssn" />
                </div>

                {/* الدولة ✅ Dropdown زي الأب */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-slate-700">
                    الدولة <Star />
                  </label>

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
                        className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm"
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
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
                  <label className="mb-1 text-sm font-semibold text-slate-700">
                    المحافظة <Star />
                  </label>
                  <input
                    type="text"
                    name="governorate"
                    value={formik.values.governorate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none shadow-sm"
                    placeholder="ادخل المحافظة"
                  />
                  <FieldError name="governorate" />
                </div>

                {/* البريد */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-slate-700">
                    البريد الإلكتروني <Star />
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    dir="ltr"
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none shadow-sm ltr:text-left"
                    placeholder="example@email.com"
                  />
                  <FieldError name="email" />
                </div>

               {/* كلمة المرور */}
<div className="flex flex-col">
  <label className="mb-1 text-sm font-semibold text-slate-700">
    كلمة المرور <span className="text-red-500">*</span>
  </label>

  <div className="relative">
    <input
      type={showPwd ? "text" : "password"}
      name="password"
      value={formik.values.password}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      dir="ltr"
      // padding يسار أكبر عشان الأيقونة داخل الحقل (RTL)
      className="w-full rounded-xl border border-slate-200 bg-white/90 py-3 pr-4 pl-10 text-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none shadow-sm text-right"
      
      autoComplete="new-password"
    />

    {/* placeholder="ابدأ بحرف كبير وتضم رقمًا" زر العين داخل الحقل - يسار عشان RTL */}
    <button
      type="button"
      onClick={() => setShowPwd((v) => !v)}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
      aria-label={showPwd ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
      title={showPwd ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
    >
      {showPwd ? <EyeClosed size={18} /> : <Eye size={18} />}
    </button>
  </div>

  {formik.errors.password && formik.touched.password && (
    <p className="text-xs mt-1 px-3 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200">
      {formik.errors.password}
    </p>
  )}
</div>


                {/* تاريخ الميلاد */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-slate-700">
                    تاريخ الميلاد <Star />
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formik.values.birthDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none shadow-sm"
                  />
                  <FieldError name="birthDate" />
                </div>

                {/* النوع */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-slate-700">
                    النوع <Star />
                  </label>
                  <select
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none shadow-sm"
                  >
                    <option value="">اختر</option>
                    <option value="Male">ذكر</option>
                    <option value="Female">أنثى</option>
                  </select>
                  <FieldError name="gender" />
                </div>

                {/* رقم الهاتف */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-slate-700">
                    رقم الهاتف <Star />
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none shadow-sm"
                    placeholder="01#########"
                  />
                  <FieldError name="phoneNumber" />
                </div>

                {/* المرحلة الدراسية */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-slate-700">
                    المرحلة الدراسية <Star />
                  </label>
                  <select
                    name="stageId"
                    value={formik.values.stageId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none shadow-sm"
                  >
                    <option value="">اختر المرحلة</option>
                    {stages.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <FieldError name="stageId" />
                </div>

                {/* الصف الدراسي */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-slate-700">
                    الصف الدراسي <Star />
                  </label>
                  <select
                    name="studyLevelId"
                    value={formik.values.studyLevelId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none shadow-sm"
                  >
                    <option value="">اختر الصف</option>
                    {studyLevels.map((lv) => (
                      <option key={lv.id} value={lv.id}>
                        {lv.level}
                      </option>
                    ))}
                  </select>
                  <FieldError name="studyLevelId" />
                </div>

                {/* الترم */}
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold text-slate-700">
                    الترم <Star />
                  </label>
                  <select
                    name="semesterId"
                    value={formik.values.semesterId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none shadow-sm"
                  >
                    <option value="">اختر الترم</option>
                    {semesters.map((sem) => (
                      <option key={sem.id} value={sem.id}>
                        {sem.name}
                      </option>
                    ))}
                  </select>
                  <FieldError name="semesterId" />
                </div>

                {/* الصورة الشخصية */}
                <div className="flex flex-col md:col-span-2">
                  <label className="mb-1 text-sm font-semibold text-slate-700">
                    الصورة الشخصية <Star />
                  </label>
                  <input
                    type="file"
                    name="photoPath"
                    onChange={(e) => formik.setFieldValue("photoPath", e.currentTarget.files?.[0] || null)}
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none shadow-sm"
                  />
                  <p className="text-xs text-slate-400 mt-1">الامتدادات المسموحة: jpg, png</p>
                  <FieldError name="photoPath" />
                </div>

                {/* آخر مؤهل دراسي */}
                <div className="flex flex-col md:col-span-2">
                  <label className="mb-1 text-sm font-semibold text-slate-700">
                    آخر مؤهل دراسي <Star />
                  </label>
                  <input
                    type="file"
                    name="lastEducationalQualifications"
                    onChange={(e) =>
                      formik.setFieldValue("lastEducationalQualifications", e.currentTarget.files?.[0] || null)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none shadow-sm"
                  />
                  <p className="text-xs text-slate-400 mt-1">PDF أو صورة واضحة للمؤهل</p>
                  <FieldError name="lastEducationalQualifications" />
                </div>

                {/* Submit */}
                <div className="md:col-span-2 mt-2">
                  <button
                    type="submit"
                    className="relative w-full rounded-2xl bg-orange-400 text-white font-extrabold py-3 text-base tracking-wide shadow-lg hover:shadow-xl hover:brightness-110 transition"
                  >
                    إنشاء حساب
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* رسالة عدم وجود أبناء (اختياري) */}
          {/* <div className="mt-6 text-center text-slate-500">لا يوجد أبناء</div> */}
        </div>
      </div>
    </>
  );
}

export default CreateChild;
