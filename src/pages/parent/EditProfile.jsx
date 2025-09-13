import React, { useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchParentInfo } from "../../store/parent/parentSlice";
import { BASE_URL } from "../../api/BASE_URL";

function EditProfile() {
  const token = useSelector((state) => state.auth.token);
  const {id} = useSelector((state) => state.auth);
  const parentInfo = useSelector((state) => state.parent.parentInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && !parentInfo) {
      dispatch(fetchParentInfo(token));
    }
  }, [token, parentInfo, dispatch]);

  // ريجكس
  const passReg = /^[A-Z][A-Za-z0-9]{5,}$/;
  const phoneReg = /^01[0125][0-9]{8}$/;

  // ملاحظات مهمة عن الـ API:
  // - الـ API عندك بتستخدم phones (مش allPhones)
  // - في الداتا المرفقة عندك fullName مش first/secondName
  // هنا هنعرض fullName كما هو، ونخلي password اختيارية للتغيير فقط.
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required("الاسم الكامل مطلوب")
      .min(5, "الاسم الكامل قصير")
      .max(60, "الاسم الكامل طويل"),
    ssn: Yup.string()
      .required("الرقم القومي مطلوب")
      .matches(/^\d{14}$/, "الرقم القومي يجب أن يكون 14 رقمًا"),
    country: Yup.string().required("الدولة مطلوبة"),
    governorate: Yup.string().required("المحافظة مطلوبة"),
    email: Yup.string().required("البريد الإلكتروني مطلوب").email("صيغة البريد غير صحيحة"),
    password: Yup.string()
      .nullable()
      .transform((v) => (v === "" ? null : v))
      .test(
        "pass-format",
        "إن أدخلت كلمة مرور، يجب أن تبدأ بحرف كبير وطولها 6 على الأقل",
        (v) => v == null || passReg.test(v)
      ),
    whatsApp_number: Yup.string()
      .nullable()
      .transform((v) => (v === "" ? null : v))
      .test("wa-format", "رقم واتساب غير صالح", (v) => v == null || phoneReg.test(v)),
    phones: Yup.array()
      .of(
        Yup.string()
          .required("رقم الهاتف مطلوب")
          .matches(phoneReg, "رقم الهاتف غير صالح")
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
      id: id ?? "",
      fullName: parentInfo?.fullName || "",
      ssn: parentInfo?.ssn || "",
      country: parentInfo?.country || "",
      governorate: parentInfo?.governorate || "",
      email: parentInfo?.email || "",
      password: "", // لا نملأها من السيرفر
      whatsApp_number: parentInfo?.whatsApp_number || "",
      phones: parentInfo?.phones?.length ? parentInfo.phones : [""],
      jobs: parentInfo?.jobs?.length ? parentInfo.jobs : [{ job: "", gender: "" }],
    },
    validationSchema,
    onSubmit: (values) => editProfile(values),
  });

  async function editProfile(values) {
    const payload = {
      // حافظ على نفس مفاتيح الـ API اللي عندك
      id: values.id,
      fullName: values.fullName,
      ssn: values.ssn,
      country: values.country,
      governorate: values.governorate,
      email: values.email,
      // ابعت الباسورد فقط لو المستخدم غيّرها
      ...(values.password ? { password: values.password } : {}),
      whatsApp_number: values.whatsApp_number || null,
      phones: values.phones,
      jobs: values.jobs,
    };

    const loadingToast = toast.loading("جارٍ التحديث...");
    try {
      const res = await axios.put(
        `${BASE_URL}/api/Parent/update-parent`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res?.data);
      toast.success("تم التحديث بنجاح!");
    } catch (err) {
      console.log(err?.response?.data);
      toast.error(err?.response?.data?.message || "حدث خطأ ما");
    } finally {
      toast.dismiss(loadingToast);
    }
  }

  // دوال مساعدة للـ UI
  const showErr = (name) =>
    formik.touched[name] && formik.errors[name] ? (
      <p className="text-red-700 bg-red-100 border border-red-200 px-3 py-2 rounded-lg mt-1 text-sm">
        {formik.errors[name]}
      </p>
    ) : null;

  return (
    <>
    <div dir="rtl" className="min-h-screen bg-gray-50 py-10 px-4">
      {/* هيدر كارت */}
      <div className="mx-auto max-w-3xl">
        {/*<div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 p-6 text-white shadow-xl">
          <h1 className="text-2xl md:text-3xl font-extrabold">تعديل الملف الشخصي</h1>
          <p className="mt-1 text-white/90">حدّث بياناتك وتأكد من أرقام التواصل.</p>
        </div>*/}

        <form
          onSubmit={formik.handleSubmit}
          className="bg-white shadow-md rounded-2xl p-6 md:p-8 space-y-6"
        >
          {/* ID (قراءة فقط) */}
          {/*<div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">معرّف الأب (ID)</label>
            <input
              type="text"
              value={formik.values.id || ""}
              readOnly
              className="w-full rounded-lg border-gray-200 bg-gray-100 px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">يُستخدم لأغراض داخلية فقط.</p>
          </div>*/}

          {/* الاسم الكامل + البريد */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">الاسم الكامل</label>
              <input
                type="text"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              {showErr("fullName")}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="example@email.com"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              {showErr("email")}
            </div>
          </div>

          {/* الدولة + المحافظة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">الدولة</label>
              <input
                type="text"
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="مصر"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              {showErr("country")}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">المحافظة</label>
              <input
                type="text"
                name="governorate"
                value={formik.values.governorate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="الجيزة"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              {showErr("governorate")}
            </div>
          </div>

          {/* الرقم القومي + واتساب */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">الرقم القومي</label>
              <input
                type="text"
                name="ssn"
                value={formik.values.ssn}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="14 رقمًا"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              {showErr("ssn")}
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
                className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              {showErr("whatsApp_number")}
            </div>
          </div>

          {/* كلمة المرور (اختيارية للتغيير) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              كلمة المرور (اختياري للتغيير)
            </label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="ابدأ بحرف كبير (A...)"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
            {showErr("password")}
            <p className="text-xs text-gray-500 mt-1">اتركها فارغة إن لم ترغب في التغيير.</p>
          </div>

          {/* الهواتف */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">أرقام الهاتف</label>
            {formik.values.phones.map((phone, idx) => (
              <div key={idx} className="flex items-start gap-2 mb-2">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    const arr = [...formik.values.phones];
                    arr[idx] = e.target.value;
                    formik.setFieldValue("phones", arr);
                  }}
                  onBlur={() => {
                    formik.setFieldTouched(`phones[${idx}]`, true);
                  }}
                  placeholder="01xxxxxxxxx"
                  className="flex-1 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const arr = formik.values.phones.filter((_, i) => i !== idx);
                    formik.setFieldValue("phones", arr.length ? arr : [""]);
                  }}
                  className="px-3 py-2 rounded-lg bg-red-500 text-white text-sm"
                  aria-label="حذف الرقم"
                >
                  حذف
                </button>
              </div>
            ))}
            {formik.touched.phones && typeof formik.errors.phones === "string" && (
              <p className="text-red-700 bg-red-100 border border-red-200 px-3 py-2 rounded-lg mt-1 text-sm">
                {formik.errors.phones}
              </p>
            )}
            <button
              type="button"
              onClick={() => formik.setFieldValue("phones", [...formik.values.phones, ""])}
              className="mt-2 px-4 py-2 rounded-lg bg-green-500 text-white text-sm"
            >
              + إضافة رقم
            </button>
          </div>

          {/* الوظائف */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الوظائف</label>
            {formik.values.jobs.map((jobObj, idx) => (
              <div key={idx} className="rounded-xl border p-4 mb-3 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">المسمى الوظيفي</label>
                    <input
                      type="text"
                      value={jobObj.job}
                      onChange={(e) => {
                        const arr = [...formik.values.jobs];
                        arr[idx].job = e.target.value;
                        formik.setFieldValue("jobs", arr);
                      }}
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: دكتور / مهندس"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">النوع</label>
                    <select
                      value={jobObj.gender}
                      onChange={(e) => {
                        const arr = [...formik.values.jobs];
                        arr[idx].gender = e.target.value;
                        formik.setFieldValue("jobs", arr);
                      }}
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
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
                      formik.setFieldValue("jobs", arr.length ? arr : [{ job: "", gender: "" }]);
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
                formik.setFieldValue("jobs", [...formik.values.jobs, { job: "", gender: "" }])
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
              className="flex-1 transition bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold shadow-sm"
            >
              حفظ التعديلات
            </button>
            <button
              type="button"
              onClick={() => formik.resetForm()}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
    
    </>
  );
}

export default EditProfile;
