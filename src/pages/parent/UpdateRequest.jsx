import axios from "axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { getStages, getStudyLevels } from "../../store/SharedData/SharedDataSlice";
import { BASE_URL } from "../../api/BASE_URL";

function UpdateRequest() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const stages = useSelector((state) => state.shared.stages);
  const studyLevels = useSelector((state) => state.shared.studyLevels);
  const requestDetails = useSelector((state) => state.parent.requestDetails);
  const {id} = useSelector((state) => state.auth);
  const requestStudentID = useSelector((state) => state.parent.requestStudentID);

  useEffect(() => {
    dispatch(getStages());
    dispatch(getStudyLevels());
  }, [dispatch]);

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("الاسم الأول مطلوب"),
    secondName: Yup.string()
      .required("الاسم الثاني مطلوب"),
    thirdName: Yup.string()
      .required("الاسم الثالث مطلوب"),
    birthDate: Yup.date()
      .required("تاريخ الميلاد مطلوب"),
    gender: Yup.string()
      .oneOf(["Male", "Female"], "النوع يجب أن يكون ذكر أو أنثى")
      .required("النوع مطلوب"),
    country: Yup.string()
      .required("الدولة مطلوبة"),
    governorate: Yup.string()
      .required("المحافظة مطلوبة"),
    ssn: Yup.string()
      .matches(/^\d{14}$/, "الرقم القومي يجب أن يكون 14 رقمًا")
      .required("الرقم القومي مطلوب"),
    email: Yup.string()
      .email("صيغة البريد الإلكتروني غير صحيحة")
      .required("البريد الإلكتروني مطلوب"),
    password: Yup.string()
      .matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, "كلمة المرور يجب أن تحتوي على حرف كبير ورقم وبطول 8 أحرف على الأقل")
      .required("كلمة المرور مطلوبة"),
    phoneNumber: Yup.string()
      .matches(/^01[0-9]{9}$/, "رقم الهاتف المصري غير صحيح")
      .required("رقم الهاتف مطلوب"),
    stageId: Yup.string()
      .required("المرحلة الدراسية مطلوبة"),
    studyLevelId: Yup.string()
      .required("الصف الدراسي مطلوب"),
    photoPath: Yup.mixed()
      .required("الصورة الشخصية مطلوبة"),
    lastEducationalQualifications: Yup.mixed()
      .required("ملف المؤهل الدراسي مطلوب"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: requestDetails?.firstName || "",
      secondName: requestDetails?.secondName || "",
      thirdName: requestDetails?.thirdName || "",
      birthDate: requestDetails?.birthDate || "",
      gender: requestDetails?.gender || "",
      country: requestDetails?.country || "",
      governorate: requestDetails?.governorate || "",
      ssn: requestDetails?.ssn || "",
      email: requestDetails?.email || "",
      password: requestDetails?.password || "",
      phoneNumber: requestDetails?.phone_Number || "",
      stageId: requestDetails?.stageId?.toString() || "",
      studyLevelId: requestDetails?.studyLevelId?.toString() || "",
      photoPath: null,
      lastEducationalQualifications: null,
      parentId: requestDetails?.parentId || id,
    },
    validationSchema,
    onSubmit: (values) => editChild(values),
  });

  async function editChild(values) {
    const loadingToast = toast.loading("جاري التحديث...");
    try {
      const formData = new FormData();
      formData.append("studentId", requestStudentID);
      formData.append("FirstName", values.firstName);
      formData.append("SecondName", values.secondName);
      formData.append("ThirdName", values.thirdName);
      formData.append("BirthDate", values.birthDate);
      formData.append("Governorate", values.governorate);
      formData.append("Gender", values.gender);
      formData.append("Country", values.country);
      formData.append("SSN", values.ssn);
      formData.append("Email", values.email);
      formData.append("Password", values.password);
      formData.append("Phone_Number", values.phoneNumber);
      formData.append("StageId", values.stageId);
      formData.append("StudyLevelId", values.studyLevelId);
      formData.append("ParentId", values.parentId);
      formData.append("PhotoPath", values.photoPath);
      formData.append("Last_educational_qualifications", values.lastEducationalQualifications);

      await axios.put(`${BASE_URL}/api/Parent/Update-student-application`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("تم تحديث بيانات الطالب بنجاح");
      // navigate('/parent/requests'); // فعّلها لو عايز ترجّع المستخدم
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء التحديث");
    } finally {
      toast.dismiss(loadingToast);
    }
  }

  const inputClass = "border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full text-right placeholder:text-right";
  const selectClass = "border p-2 mt-1 mb-5 w-full rounded-lg text-right";

  return (
    <div dir="rtl" className="flex flex-col justify-center sm:py-12 mt-10">
      <div className="shadow-2xl p-10 xs:p-0 mx-auto max-w-2xl bg-white">
        <h1 className="font-bold text-center text-2xl mb-5">تحديث بيانات الطالب</h1>
        <form onSubmit={formik.handleSubmit} className="text-right">
          <div className="px-5 py-7">

            {/* الاسم الأول */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">الاسم الأول</label>
            <input type="text" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass} />
            {formik.errors.firstName && formik.touched.firstName && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.firstName}</p>)}

            {/* الاسم الثاني */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">الاسم الثاني</label>
            <input type="text" name="secondName" value={formik.values.secondName} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass} />
            {formik.errors.secondName && formik.touched.secondName && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.secondName}</p>)}

            {/* الاسم الثالث */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">الاسم الثالث</label>
            <input type="text" name="thirdName" value={formik.values.thirdName} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass} />
            {formik.errors.thirdName && formik.touched.thirdName && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.thirdName}</p>)}

            {/* الرقم القومي */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">الرقم القومي</label>
            <input type="text" name="ssn" value={formik.values.ssn} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass} />
            {formik.errors.ssn && formik.touched.ssn && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.ssn}</p>)}

            {/* المحافظة */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">المحافظة</label>
            <input type="text" name="governorate" value={formik.values.governorate} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass} />
            {formik.errors.governorate && formik.touched.governorate && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.governorate}</p>)}

            {/* الدولة */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">الدولة</label>
            <input type="text" name="country" value={formik.values.country} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass} />
            {formik.errors.country && formik.touched.country && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.country}</p>)}

            {/* البريد الإلكتروني */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">البريد الإلكتروني</label>
            <input type="text" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`${inputClass} ltr:text-left`} dir="ltr" />
            {formik.errors.email && formik.touched.email && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.email}</p>)}

            {/* كلمة المرور */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">كلمة المرور</label>
            <input type="password" name="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`${inputClass} ltr:text-left`} dir="ltr" />
            {formik.errors.password && formik.touched.password && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.password}</p>)}

            {/* تاريخ الميلاد */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">تاريخ الميلاد</label>
            <input type="date" name="birthDate" value={formik.values.birthDate} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass} />
            {formik.errors.birthDate && formik.touched.birthDate && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.birthDate}</p>)}

            {/* النوع */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">النوع</label>
            <select name="gender" value={formik.values.gender} onChange={formik.handleChange} className={selectClass}>
              <option value="">اختر النوع</option>
              <option value="Male">ذكر</option>
              <option value="Female">أنثى</option>
            </select>
            {formik.errors.gender && formik.touched.gender && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.gender}</p>)}

            {/* المرحلة الدراسية */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">المرحلة الدراسية</label>
            <select name="stageId" value={formik.values.stageId} onChange={formik.handleChange} className={selectClass}>
              <option value="">اختر المرحلة</option>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {formik.errors.stageId && formik.touched.stageId && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.stageId}</p>)}

            {/* الصف الدراسي */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">الصف الدراسي</label>
            <select name="studyLevelId" value={formik.values.studyLevelId} onChange={formik.handleChange} className={selectClass}>
              <option value="">اختر الصف</option>
              {studyLevels.map((l) => (
                <option key={l.id} value={l.id}>{l.level}</option>
              ))}
            </select>
            {formik.errors.studyLevelId && formik.touched.studyLevelId && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.studyLevelId}</p>)}

            {/* الصورة الشخصية */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">الصورة الشخصية</label>
            <input
              type="file"
              name="photoPath"
              onChange={(e) => formik.setFieldValue("photoPath", e.currentTarget.files[0])}
              className={inputClass}
            />
            {formik.errors.photoPath && formik.touched.photoPath && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.photoPath}</p>)}

            {/* المؤهل الدراسي */}
            <label className="font-semibold text-sm text-gray-600 pb-1 block">آخر مؤهل دراسي</label>
            <input
              type="file"
              name="lastEducationalQualifications"
              onChange={(e) => formik.setFieldValue("lastEducationalQualifications", e.currentTarget.files[0])}
              className={inputClass}
            />
            {formik.errors.lastEducationalQualifications && formik.touched.lastEducationalQualifications && (
              <p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.lastEducationalQualifications}</p>
            )}

            <button
              type="submit"
              className="transition duration-200 bg-blue-600 hover:bg-blue-700 text-white w-full py-2.5 rounded-lg text-sm font-semibold"
            >
              تحديث البيانات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateRequest;
