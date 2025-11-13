// src/pages/parent/UpdateRequest.jsx
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { getStages, getStudyLevels } from "../../store/SharedData/SharedDataSlice";
import { BASE_URL } from "../../api/BASE_URL";
import { useNavigate } from "react-router-dom";

/* ===== helpers ===== */
function fileNameFromUrl(u) {
  if (!u) return "";
  try {
    const x = new URL(u);
    const last = x.pathname.split("/").pop() || "";
    return decodeURIComponent(last);
  } catch {
    return String(u).split("/").pop() || "";
  }
}
// كشف إن خطأ الـ API معناه بريد مكرر
function isDuplicateEmailError(err) {
  const res = err?.response;
  if (!res) return false;
  const statusDup = res.status === 409; // بعض APIs بترجع 409
  const raw = res.data || {};
  const msg = String(raw.message || raw.title || "").toLowerCase();
  const joinedErrors =
    Array.isArray(raw.errors)
      ? raw.errors.join(" ").toLowerCase()
      : typeof raw.errors === "object"
      ? Object.values(raw.errors).flat().join(" ").toLowerCase()
      : "";

  const hit =
    msg.includes("unique") ||
    msg.includes("already") ||
    msg.includes("exists") ||
    msg.includes("مسجل") ||
    msg.includes("موجود") ||
    joinedErrors.includes("unique") ||
    joinedErrors.includes("already") ||
    joinedErrors.includes("exists") ||
    joinedErrors.includes("مسجل") ||
    joinedErrors.includes("موجود");

  return statusDup || hit;
}
/* ==================== */

export default function UpdateRequest() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { id: parentId } = useSelector((s) => s.auth);

  const stages = useSelector((state) => state.shared.stages) || [];
  const studyLevels = useSelector((state) => state.shared.studyLevels) || [];
  const requestDetails = useSelector((state) => state.parent.requestDetails);
  const requestStudentID = useSelector((state) => state.parent.requestStudentID);
   
  useEffect(() => {
    dispatch(getStages());
    dispatch(getStudyLevels());
  }, [dispatch]);

  // ===== دول =====
  const [countries, setCountries] = useState([]); // [{code, displayName, nameAr, nameEn}]
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesErr, setCountriesErr] = useState("");

  // ===== معاينات الملفات =====
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [docLink, setDocLink] = useState("");
  const [docName, setDocName] = useState("");

  // 👁️ إظهار/إخفاء كلمة المرور
  const [showPwd, setShowPwd] = useState(false);

  // حضّر معاينات من الداتا الجاية
  useEffect(() => {
    if (requestDetails?.photoPath) {
      setPhotoPreview(requestDetails.photoPath);
      setPhotoName(fileNameFromUrl(requestDetails.photoPath));
    }
    if (requestDetails?.last_educational_qualifications) {
      const link = requestDetails.last_educational_qualifications;
      setDocLink(link);
      setDocName(fileNameFromUrl(link) || "الملف الحالي");
    }
  }, [requestDetails]);

  // حمّل الدول واضبط الديفولت "مصر" لو مفيش قيمة جاية
  useEffect(() => {
    let alive = true;
    async function loadCountries() {
      try {
        setCountriesLoading(true);
        setCountriesErr("");
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,translations"
        );
        const raw = await res.json();

        const mapped = (Array.isArray(raw) ? raw : [])
          .map((c) => {
            const nameAr = c?.translations?.ara?.common || c?.name?.common || "";
            const nameEn = c?.name?.official || c?.name?.common || "";
            const displayName = nameAr || nameEn;
            return { code: c?.cca2 || c?.cca3 || nameEn, nameAr, nameEn, displayName };
          })
          .sort((a, b) =>
            (a.displayName || "").localeCompare(b.displayName || "", "ar")
          );

        if (!alive) return;

        // لو في دولة جاية من الـ API ومش موجودة في الليست، ضيفها أول خيار علشان تفضل ظاهرة
        const incomingCountry = (requestDetails?.country || "").trim();
        const exists = mapped.some((x) => x.displayName === incomingCountry);
        const listWithIncoming =
          exists || !incomingCountry
            ? mapped
            : [
                {
                  code: "current",
                  displayName: incomingCountry,
                  nameAr: incomingCountry,
                  nameEn: incomingCountry,
                },
                ...mapped,
              ];

        setCountries(listWithIncoming);

        // Default "مصر" لو مفيش قيمة
        if (!formik.values.country) {
          const egypt =
            listWithIncoming.find(
              (x) =>
                x.code === "EG" ||
                /Egypt/i.test(x.nameEn) ||
                x.displayName === "مصر"
            ) || listWithIncoming[0];
          if (egypt) formik.setFieldValue("country", egypt.displayName);
        }
      } catch {
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

  // ===== فاليديشن (بدون محافظة/رقم قومي) =====
  const passReg = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const phoneEg = /^01[0-9]{9}$/;

  const validationSchema = Yup.object({
    firstName: Yup.string().required("الاسم الأول مطلوب"),
    secondName: Yup.string().required("الاسم الثاني مطلوب"),
    thirdName: Yup.string().required("الاسم الثالث مطلوب"),
    birthDate: Yup.date().required("تاريخ الميلاد مطلوب"),
    gender: Yup.string()
      .oneOf(["Male", "Female"], "النوع يجب أن يكون ذكر أو أنثى")
      .required("النوع مطلوب"),
    country: Yup.string().required("الدولة مطلوبة"),
    email: Yup.string()
      .email("صيغة البريد الإلكتروني غير صحيحة")
      .required("البريد الإلكتروني مطلوب"),
    password: Yup.string()
      .matches(
        passReg,
        "كلمة المرور يجب أن تحتوي على حرف كبير ورقم وبطول 8 أحرف على الأقل"
      )
      .required("كلمة المرور مطلوبة"),
    phoneNumber: Yup.string()
      .matches(phoneEg, "رقم الهاتف المصري غير صحيح")
      .required("رقم الهاتف مطلوب"),
    stageId: Yup.string().required("المرحلة الدراسية مطلوبة"),
    studyLevelId: Yup.string().required("الصف الدراسي مطلوب"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: requestDetails?.firstName || "",
      secondName: requestDetails?.secondName || "",
      thirdName: requestDetails?.thirdName || "",
      birthDate: requestDetails?.birthDate || "",
      gender: requestDetails?.gender || "",
      // نسيبها زي ما جاية من الـ API، ولو فاضية هنعمل ديفولت مصر بعد تحميل الدول
      country: requestDetails?.country || "",
      email: requestDetails?.email || "",
      password: requestDetails?.password || "",
      phoneNumber: requestDetails?.phone_Number || "",
      stageId: requestDetails?.stageId?.toString() || "",
      studyLevelId: requestDetails?.studyLevelId?.toString() || "",
      photoPath: null,
      lastEducationalQualifications: null,
      parentId: requestDetails?.parentId || parentId,
    },
    validationSchema,
    onSubmit: (values, helpers) => editChild(values, helpers),
  });

  const authHeaders = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  // اختيار صورة (نفس EditStudent)
  const onPickPhoto = (e) => {
    const file = e.currentTarget.files?.[0] || null;
    if (file) {
      const allowed = ["image/jpeg", "image/png"];
      if (!allowed.includes(file.type)) {
        toast.error("الرجاء اختيار صورة بامتداد JPG أو PNG فقط");
        formik.setFieldValue("photoPath", null);
        return;
      }
      setPhotoPreview(URL.createObjectURL(file));
      setPhotoName(file.name);
      formik.setFieldValue("photoPath", file);
    } else {
      // رجّع الصورة القديمة
      const apiPhoto = requestDetails?.photoPath || "";
      setPhotoPreview(apiPhoto);
      setPhotoName(fileNameFromUrl(apiPhoto));
      formik.setFieldValue("photoPath", null);
    }
  };

  // اختيار المؤهل (زي الأبديت)
  const onPickDoc = (e) => {
    const file = e.currentTarget.files?.[0] || null;
    if (file) {
      const ok = ["application/pdf", "image/jpeg", "image/png"].includes(file.type);
      if (!ok) {
        toast.error("المؤهل الدراسي المسموح: PDF أو صورة (JPG/PNG)");
        formik.setFieldValue("lastEducationalQualifications", null);
        return;
      }
      setDocLink(""); // لحد ما يتبعت
      setDocName(file.name);
      formik.setFieldValue("lastEducationalQualifications", file);
    } else {
      // رجّع القديم
      const link = requestDetails?.last_educational_qualifications || "";
      setDocLink(link);
      setDocName(fileNameFromUrl(link) || "");
      formik.setFieldValue("lastEducationalQualifications", null);
    }
  };

  async function editChild(values, { setFieldError }) {
    const loading = toast.loading("جاري التحديث...");
    try {
      const formData = new FormData();
      formData.append("studentId", String(requestStudentID));
      formData.append("FirstName", values.firstName);
      formData.append("SecondName", values.secondName);
      formData.append("ThirdName", values.thirdName);
      formData.append("BirthDate", values.birthDate);
      formData.append("Gender", values.gender);
      formData.append("Country", values.country);
      formData.append("Email", values.email);
      formData.append("Password", values.password);
      formData.append("Phone_Number", values.phoneNumber);
      formData.append("StageId", String(Number(values.stageId)));
      formData.append("StudyLevelId", String(Number(values.studyLevelId)));
      formData.append("ParentId", String(Number(values.parentId)));

      if (values.photoPath) {
        formData.append("PhotoPath", values.photoPath);
      }
      if (values.lastEducationalQualifications) {
        formData.append(
          "Last_educational_qualifications",
          values.lastEducationalQualifications
        );
      }

      const { data } = await axios.put(
        `${BASE_URL}/api/Parent/Update-student-application`,
        formData,
        authHeaders
      );

      // حدّث المعاينات من رد السيرفر (لو رجّع روابط جديدة)
      if (data?.photoPath) {
        setPhotoPreview(data.photoPath);
        setPhotoName(fileNameFromUrl(data.photoPath));
      }
      if (data?.last_educational_qualifications) {
        setDocLink(data.last_educational_qualifications);
        setDocName(
          fileNameFromUrl(data.last_educational_qualifications) || docName
        );
      }

      toast.success("تم تحديث بيانات الطالب بنجاح");
      navigate("/parent/requests");

    } catch (err) {
      // ✅ معالجة الإيميل المكرر
      if (isDuplicateEmailError(err)) {
        setFieldError("email", "هذا البريد مسجّل بالفعل. يرجى إدخال بريد آخر.");
        toast.error("هذا البريد مسجّل بالفعل. يرجى إدخال بريد آخر.");
      } else {
        toast.error(err?.response?.data?.message || "حدث خطأ أثناء التحديث");
      }
    } finally {
      toast.dismiss(loading);
    }
  }

  const inputClass =
    "border rounded-lg px-3 py-2 mt-1 mb-3 text-sm w-full text-right placeholder:text-right";
  const selectClass = "border px-3 py-2 mt-1 mb-3 w-full rounded-lg text-right";

  return (
    <div dir="rtl" className="flex flex-col justify-center sm:py-12 mt-10">
      <div className="shadow-2xl p-10 mx-auto max-w-2xl bg-white rounded-2xl">
        <h1 className="font-bold text-center text-2xl mb-5">تحديث طلب الطالب</h1>

        {/* معاينة الصورة الحالية (دائري) */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-20 w-20 rounded-full overflow-hidden ring-2 ring-slate-200 bg-slate-100">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="صورة الطالب"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                لا صورة
              </div>
            )}
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="text-right">
          {/* الاسم الأول */}
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            الاسم الأول
          </label>
          <input
            type="text"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <p className="bg-red-300 p-3 rounded-2xl my-2">
              {formik.errors.firstName}
            </p>
          )}

          {/* الاسم الثاني */}
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            الاسم الثاني
          </label>
          <input
            type="text"
            name="secondName"
            value={formik.values.secondName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />
          {formik.touched.secondName && formik.errors.secondName && (
            <p className="bg-red-300 p-3 rounded-2xl my-2">
              {formik.errors.secondName}
            </p>
          )}

          {/* الاسم الثالث */}
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            الاسم الثالث
          </label>
          <input
            type="text"
            name="thirdName"
            value={formik.values.thirdName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />
          {formik.touched.thirdName && formik.errors.thirdName && (
            <p className="bg-red-300 p-3 rounded-2xl my-2">
              {formik.errors.thirdName}
            </p>
          )}

          {/* الدولة */}
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            الدولة
          </label>
          {countriesLoading ? (
            <div className="h-10 rounded bg-gray-100 animate-pulse mb-3" />
          ) : countriesErr ? (
            <>
              <input
                type="text"
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass}
                placeholder="ادخل الدولة يدويًا"
              />
              <p className="text-xs text-amber-600 -mt-2 mb-3">{countriesErr}</p>
            </>
          ) : (
            <select
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={selectClass}
            >
              <option value="">اختر الدولة</option>
              {countries.map((c) => (
                <option key={`${c.code}-${c.displayName}`} value={c.displayName}>
                  {c.displayName}
                </option>
              ))}
            </select>
          )}
          {formik.touched.country && formik.errors.country && (
            <p className="bg-red-300 p-3 rounded-2xl my-2">
              {formik.errors.country}
            </p>
          )}

          {/* البريد الإلكتروني */}
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${inputClass} ltr:text-left`}
            dir="ltr"
            placeholder="example@email.com"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="bg-red-300 p-3 rounded-2xl my-2">
              {formik.errors.email}
            </p>
          )}

          {/* كلمة المرور + زر العين */}
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
  كلمة المرور
</label>
<div className="relative">
  <input
    type={showPwd ? "text" : "password"}
    name="password"
    value={formik.values.password}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    dir="rtl"                             // ✅ خليه RTL
    className={`${inputClass} text-right pr-3 pl-10`} // ✅ يمين + مسافة يسار للعين
    placeholder="••••••••"
  />
  <button
    type="button"
    onClick={() => setShowPwd((v) => !v)}
    onMouseDown={(e) => e.preventDefault()}
    className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
    aria-label={showPwd ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
    title={showPwd ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
  >
    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>
{formik.touched.password && formik.errors.password && (
  <p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.password}</p>
)}

          {/* تاريخ الميلاد */}
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            تاريخ الميلاد
          </label>
          <input
            type="date"
            name="birthDate"
            value={formik.values.birthDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />
          {formik.touched.birthDate && formik.errors.birthDate && (
            <p className="bg-red-300 p-3 rounded-2xl my-2">
              {formik.errors.birthDate}
            </p>
          )}

          {/* النوع */}
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            النوع
          </label>
          <select
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={selectClass}
          >
            <option value="">اختر النوع</option>
            <option value="Male">ذكر</option>
            <option value="Female">أنثى</option>
          </select>
          {formik.touched.gender && formik.errors.gender && (
            <p className="bg-red-300 p-3 rounded-2xl my-2">
              {formik.errors.gender}
            </p>
          )}

          {/* المرحلة الدراسية */}
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            المرحلة الدراسية
          </label>
          <select
            name="stageId"
            value={formik.values.stageId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={selectClass}
          >
            <option value="">اختر المرحلة</option>
            {stages.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {formik.touched.stageId && formik.errors.stageId && (
            <p className="bg-red-300 p-3 rounded-2xl my-2">
              {formik.errors.stageId}
            </p>
          )}

          {/* الصف الدراسي */}
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            الصف الدراسي
          </label>
          <select
            name="studyLevelId"
            value={formik.values.studyLevelId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={selectClass}
          >
            <option value="">اختر الصف</option>
            {studyLevels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.level}
              </option>
            ))}
          </select>
          {formik.touched.studyLevelId && formik.errors.studyLevelId && (
            <p className="bg-red-300 p-3 rounded-2xl my-2">
              {formik.errors.studyLevelId}
            </p>
          )}

          {/* الصورة الشخصية */}
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            الصورة الشخصية
          </label>
          <div className="flex items-center gap-3 mb-5">
            <input
              type="file"
              name="photoPath"
              accept=".jpg,.jpeg,.png"
              onChange={onPickPhoto}
              className="border rounded-lg px-3 py-2 text-sm w-full"
            />
            <span className="text-xs text-slate-600 whitespace-nowrap">
              {photoName || "لم يتم اختيار ملف"}
            </span>
          </div>

          {/* آخر مؤهل دراسي */}
          <label className="font-semibold text-sm text-gray-600 pb-1 block">
            آخر مؤهل دراسي
          </label>
          <div className="flex items-center gap-3 mb-5">
            <input
              type="file"
              name="lastEducationalQualifications"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={onPickDoc}
              className="border rounded-lg px-3 py-2 text-sm w-full"
            />
            <span className="text-xs text-slate-600 whitespace-nowrap">
              {docName || "لم يتم اختيار ملف"}
            </span>
          </div>

          {/* لينك المؤهل القديم/الجديد */}
          <div className="mb-6">
            <div className="text-xs text-slate-600 mb-1">ملف المؤهل الحالي</div>
            {docLink ? (
              <a
                href={docLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline break-all text-sm"
              >
                {docName || "فتح الملف"}
              </a>
            ) : (
              <div className="text-xs text-slate-500">
                {docName || "لا يوجد ملف"}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="transition duration-200 bg-slate-800 hover:bg-slate-900 text-white w-full py-2.5 rounded-lg text-sm font-semibold"
          >
            تحديث البيانات
          </button>
        </form>
      </div>
    </div>
  );
}
