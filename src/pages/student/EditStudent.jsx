// src/pages/student/EditStudent.jsx
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { fetchStudentInfo } from "../../store/student/studentSlice";
import { BASE_URL } from "../../api/BASE_URL";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

function isDuplicateEmailError(err) {
  const res = err?.response;
  if (!res) return false;
  const statusDup = res.status === 409; // شائع للإيميل المكرر
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

const pwdReg = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

function EditStudent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((s) => s.auth.token);
  const { id: studentId } = useSelector((s) => s.auth);
  const studentinfo = useSelector((s) => s.student.studentinfo);

  useEffect(() => {
    if (studentId && token) {
      dispatch(fetchStudentInfo({ studentId, token }));
    }
  }, [dispatch, studentId, token]);

  // معاينة واسم الصورة
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoName, setPhotoName] = useState("");
  useEffect(() => {
    const apiPhoto = studentinfo?.photo || "";
    setPhotoPreview(apiPhoto);
    setPhotoName(fileNameFromUrl(apiPhoto));
  }, [studentinfo]);

  const [showPwd, setShowPwd] = useState(false);

  // ================= الدول =================
  const [countries, setCountries] = useState([]); // [{code, nameAr, nameEn, displayName}]
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesErr, setCountriesErr] = useState("");

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
            const nameAr =
              c?.translations?.ara?.common || c?.name?.common || "";
            const nameEn = c?.name?.official || c?.name?.common || "";
            const displayName = nameAr || nameEn;
            return {
              code: c?.cca2 || c?.cca3 || nameEn,
              nameAr,
              nameEn,
              displayName,
            };
          })
          .sort((a, b) =>
            (a.displayName || "").localeCompare(b.displayName || "", "ar")
          );

        if (!alive) return;
        setCountries(mapped);

        // اختَر "مصر" افتراضيًا لو الحقل لسه فاضي
        const current = (formik.values.country || "").trim();
        if (!current && mapped.length) {
          const egypt =
            mapped.find(
              (x) =>
                x.code === "EG" ||
                /Egypt/i.test(x.nameEn) ||
                x.nameAr === "مصر"
            ) || mapped[0];
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
    // ما نحطّش formik في deps عشان ما نعملش override على قيمة المستخدم/API
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("الاسم الأول مطلوب"),
    country: Yup.string().required("الدولة مطلوبة"),

    email: Yup.string()
      .transform((v) => (v === "" ? null : v))
      .nullable()
      .email("بريد إلكتروني غير صالح"),

    password: Yup.string()
      .transform((v) => (v === "" ? null : v))
      .nullable()
      .test(
        "pwd-strong",
        "كلمة المرور يجب أن تحتوي على حرف كبير ورقم على الأقل وطولها لا يقل عن 8",
        (v) => v == null || pwdReg.test(v)
      ),

    photoPath: Yup.mixed().nullable(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: studentinfo?.firstName || "",
      country: studentinfo?.country || "",
      email: studentinfo?.email || "", // اختياري
      password: studentinfo?.password || "", // ما نملأش الباسورد من الـ API لأمان أفضل
      photoPath: null,
    },
    validationSchema,
    onSubmit: (values, helpers) => editStudent(values, helpers),
  });

  // عند اختيار صورة جديدة: خزّن الملف وغيّر المعاينة والاسم
  const onPickPhoto = (e) => {
    const file = e.currentTarget.files?.[0] || null;
    formik.setFieldValue("photoPath", file);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      setPhotoName(file.name);
    } else {
      const apiPhoto = studentinfo?.photo || "";
      setPhotoPreview(apiPhoto);
      setPhotoName(fileNameFromUrl(apiPhoto));
    }
  };

  async function editStudent(values, { setFieldError }) {
    const loading = toast.loading("جارٍ التحديث...");
    try {
      const fd = new FormData();
      fd.append("Id", String(studentId));
      fd.append("FirstName", values.firstName);
      fd.append("Country", values.country);

      // فقط لو في قيمة حقيقية
      const email = (values.email || "").trim();
      if (email) fd.append("Email", email);

      const pwd = (values.password || "").trim();
      if (pwd) fd.append("Password", pwd);

      if (values.photoPath) fd.append("PhotoPath", values.photoPath);

      await axios.put(`${BASE_URL}/api/Student/Update-student`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("تم تحديث بيانات الطالب بنجاح");
      if (studentId && token) {
        dispatch(fetchStudentInfo({ studentId, token }));
      }
      navigate("/student/student-profile");
    } catch (err) {
      if (isDuplicateEmailError(err)) {
        setFieldError("email", "هذا البريد مسجّل بالفعل. يرجى إدخال بريد آخر.");
        toast.error("هذا البريد مسجّل بالفعل. يرجى إدخال بريد آخر.");
      } else {
        const msg =
          err?.response?.data?.message ||
          Object.values(err?.response?.data?.errors || {})?.[0]?.[0] ||
          err?.message ||
          "حدث خطأ أثناء التحديث";
        toast.error(msg);
      }
    } finally {
      toast.dismiss(loading);
    }
  }

  return (
    <div className="flex flex-col justify-center sm:py-12 mt-10" dir="rtl">
      <div className="shadow-2xl p-10 mx-auto max-w-2xl bg-white rounded-2xl">
        <h1 className="font-bold text-center text-2xl mb-5">تعديل بيانات الطالب</h1>

        {/* معاينة الصورة الحالية */}
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

        <form onSubmit={formik.handleSubmit}>
          <div className="px-5 py-7">
            {/* FirstName */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">
              الاسم الأول *
            </label>
            <input
              type="text"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded-lg px-3 py-2 mt-1 mb-3 text-sm w-full"
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="bg-red-300 p-3 rounded-2xl my-2">
                {formik.errors.firstName}
              </p>
            )}

            {/* Country - بنفس أسلوب CreateChild */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">
              الدولة *
            </label>

            {countriesLoading ? (
              <div className="h-10 rounded-lg bg-gray-100 animate-pulse mb-3" />
            ) : countriesErr ? (
              <>
                <input
                  type="text"
                  name="country"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border rounded-lg px-3 py-2 mt-1 mb-1 text-sm w-full"
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
                className="border rounded-lg px-3 py-2 mt-1 mb-3 text-sm w-full bg-white"
              >
                <option value="">اختر الدولة</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.displayName}>
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

            {/* Email (اختياري) */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded-lg px-3 py-2 mt-1 mb-3 text-sm w-full"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="bg-red-300 p-3 rounded-2xl my-2">
                {formik.errors.email}
              </p>
            )}

            {/* Password (اختياري) + 👁️ زر العين */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">
              كلمة المرور
            </label>
            <div className="relative mb-3">
              <input
                type={showPwd ? "text" : "password"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border rounded-lg px-3 py-2 text-sm w-full"
                autoComplete="new-password"
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
            {formik.touched.password && formik.errors.password && (
              <p className="bg-red-300 p-3 rounded-2xl my-2">
                {formik.errors.password}
              </p>
            )}

            {/* Photo (اختياري) */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">
              الصورة الشخصية
            </label>
            <div className="flex items-center gap-3 mb-5">
              <input
                type="file"
                name="photoPath"
                accept="image/*"
                onChange={onPickPhoto}
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />
              <span className="text-xs text-slate-600 whitespace-nowrap">
                {photoName || "لم يتم اختيار ملف"}
              </span>
            </div>

            <button
              type="submit"
              className="transition duration-200 bg-slate-800 hover:bg-slate-900 text-white w-full py-2.5 rounded-lg text-sm font-semibold"
            >
              تحديث البيانات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStudent;
