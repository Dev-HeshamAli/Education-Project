import { useFormik } from 'formik';
import { useEffect } from 'react';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { getStages, getStudyLevels ,getSemesters} from '../../store/SharedData/SharedDataSlice';
import { createDisStudent } from '../../store/student/studentSlice';

function CreateDisChild() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const userInfo = useSelector((state) => state.auth.userData);
  const stages = useSelector((state) => state.shared.stages);
  const studyLevels = useSelector((state) => state.shared.studyLevels);
  const semesters = useSelector((state) => state.shared.semesters);

  useEffect(() => {
    dispatch(getStages());
    dispatch(getStudyLevels());
    dispatch(getSemesters());
  }, [dispatch]);

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required('الاسم الأول مطلوب')
      .min(3, 'الاسم الأول يجب أن يكون 3 أحرف على الأقل')
      .max(20, 'الاسم الأول يجب أن يكون 20 حرفًا بحد أقصى'),

    secondName: Yup.string()
      .required('الاسم الثاني مطلوب')
      .min(3, 'الاسم الثاني يجب أن يكون 3 أحرف على الأقل')
      .max(20, 'الاسم الثاني يجب أن يكون 20 حرفًا بحد أقصى'),

    thirdName: Yup.string()
      .required('الاسم الثالث مطلوب')
      .min(3, 'الاسم الثالث يجب أن يكون 3 أحرف على الأقل')
      .max(20, 'الاسم الثالث يجب أن يكون 20 حرفًا بحد أقصى'),

    birthDate: Yup.date().required('تاريخ الميلاد مطلوب'),

    gender: Yup.string()
      .oneOf(['Male', 'Female'], 'النوع يجب أن يكون ذكر أو أنثى')
      .required('النوع مطلوب'),

    country: Yup.string().required('الدولة مطلوبة'),

    photoPath: Yup.mixed().required('الصورة الشخصية مطلوبة'),

    lastEducationalQualifications: Yup.mixed()
      .required('ملف المؤهل الدراسي مطلوب'),

    medicalReports: Yup.mixed()
      .required('ملف التقرير الطبي مطلوب'),

    ssn: Yup.string()
      .required('الرقم القومي مطلوب')
      .matches(/^\d{14}$/, 'الرقم القومي يجب أن يتكون من 14 رقم'),

    email: Yup.string()
      .required('البريد الإلكتروني مطلوب')
      .email('صيغة البريد الإلكتروني غير صحيحة'),

    password: Yup.string()
      .required('كلمة المرور مطلوبة')
      .matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, 'كلمة المرور يجب أن تحتوي على حرف كبير ورقم وأن تكون 8 أحرف على الأقل'),

    phoneNumber: Yup.string()
      .required('رقم الهاتف مطلوب')
      .matches(/^01[0-9]{9}$/, 'رقم الهاتف يجب أن يكون رقم مصري صحيح'),

    governorate: Yup.string().required('المحافظة مطلوبة'),

    stageId: Yup.string().required('المرحلة الدراسية مطلوبة'),
    studyLevelId: Yup.string().required('الصف الدراسي مطلوب'),
    semesterId: Yup.string().required('ترم الدراسي مطلوب'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      secondName: '',
      thirdName: '',
      birthDate: '',
      gender: '',
      country: '',
      governorate: '',                // ✅ مضاف
      photoPath: null,
      lastEducationalQualifications: null,
      medicalReports: null,
      ssn: '',
      email: '',
      password: '',
      phoneNumber: '',
      stageId: '',
      studyLevelId: '',
      semesterId: '',
      parentId: userInfo.id
    },
    onSubmit: (x) => addStudent(x),
    validationSchema
  });

  async function addStudent(values) {
    const loadingToast = toast.loading('جاري التحميل...');
    try {
      const formData = new FormData();

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
      formData.append("semesterId", values.semesterId);
      formData.append("ParentId", values.parentId);
      formData.append("PhotoPath", values.photoPath);
      formData.append("Last_educational_qualifications", values.lastEducationalQualifications);
      formData.append("Medical_reports", values.medicalReports);

      dispatch(createDisStudent({ formData, token }));
    } catch (err) {
      console.log(err);
    } finally {
      toast.dismiss(loadingToast);
    }
  }

  const inputClass = "border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full text-right placeholder:text-right";
  const selectClass = "border p-2 mt-1 mb-5 w-full rounded-lg text-right";

  return (
    <div dir="rtl" className="flex flex-col justify-center sm:py-12 mt-10">
      <div className="shadow-2xl p-10 xs:p-0 mx-auto max-w-2xl">
        <h1 className="font-bold text-center text-2xl mb-5">حساب طالب (ذوي الهمم)</h1>
        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <form onSubmit={formik.handleSubmit} className="text-right">
            <div className="px-5 py-7">
              <label className="font-semibold text-sm text-gray-600 pb-1 block">الاسم الأول</label>
              <input type="text" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass} />
              {formik.errors.firstName && formik.touched.firstName && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.firstName}</p>)}

              <label className="font-semibold text-sm text-gray-600 pb-1 block">الاسم الثاني</label>
              <input type="text" name="secondName" value={formik.values.secondName} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass} />
              {formik.errors.secondName && formik.touched.secondName && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.secondName}</p>)}

              <label className="font-semibold text-sm text-gray-600 pb-1 block">الاسم الثالث</label>
              <input type="text" name="thirdName" value={formik.values.thirdName} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass} />
              {formik.errors.thirdName && formik.touched.thirdName && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.thirdName}</p>)}

              <label className="font-semibold text-sm text-gray-600 pb-1 block">الرقم القومي</label>
              <input type="text" name="ssn" value={formik.values.ssn} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass} />
              {formik.errors.ssn && formik.touched.ssn && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.ssn}</p>)}

              <label className="font-semibold text-sm text-gray-600 pb-1 block">المحافظة</label>
              <input type="text" name="governorate" value={formik.values.governorate} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass} />
              {formik.errors.governorate && formik.touched.governorate && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.governorate}</p>)}

              <label className="font-semibold text-sm text-gray-600 pb-1 block">الدولة</label>
              <input type="text" name="country" value={formik.values.country} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass} />
              {formik.errors.country && formik.touched.country && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.country}</p>)}

              <label className="font-semibold text-sm text-gray-600 pb-1 block">البريد الإلكتروني</label>
              <input type="text" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`${inputClass} ltr:text-left`} dir="ltr" />
              {formik.errors.email && formik.touched.email && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.email}</p>)}

              <label className="font-semibold text-sm text-gray-600 pb-1 block">كلمة المرور</label>
              <input type="password" name="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`${inputClass} ltr:text-left`} dir="ltr" />
              {formik.errors.password && formik.touched.password && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.password}</p>)}

              <label className="font-semibold text-sm text-gray-600 pb-1 block">تاريخ الميلاد</label>
              <input type="date" name="birthDate" value={formik.values.birthDate} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass} />
              {formik.errors.birthDate && formik.touched.birthDate && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.birthDate}</p>)}

              <label className="font-semibold text-sm text-gray-600 pb-1 block">النوع</label>
              <select name="gender" value={formik.values.gender} onChange={formik.handleChange} onBlur={formik.handleBlur} className={selectClass}>
                <option value="">اختر النوع</option>
                <option value="Male">ذكر</option>
                <option value="Female">أنثى</option>
              </select>
              {formik.errors.gender && formik.touched.gender && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.gender}</p>)}

              <label className="font-semibold text-sm text-gray-600 pb-1 block">رقم الهاتف</label>
              <input type="text" name="phoneNumber" value={formik.values.phoneNumber} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputClass} />
              {formik.errors.phoneNumber && formik.touched.phoneNumber && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.phoneNumber}</p>)}

              <label className="font-semibold text-sm text-gray-600 pb-1 block">المرحلة الدراسية</label>
              <select name="stageId" value={formik.values.stageId} onChange={formik.handleChange} onBlur={formik.handleBlur} className={selectClass}>
                <option value="">اختر المرحلة</option>
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>{stage.name}</option>
                ))}
              </select>
              {formik.errors.stageId && formik.touched.stageId && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.stageId}</p>)}

              <label className="font-semibold text-sm text-gray-600 pb-1 block">الصف الدراسي</label>
              <select name="studyLevelId" value={formik.values.studyLevelId} onChange={formik.handleChange} onBlur={formik.handleBlur} className={selectClass}>
                <option value="">اختر الصف</option>
                {studyLevels.map((studyLevel) => (
                  <option key={studyLevel.id} value={studyLevel.id}>{studyLevel.level}</option>
                ))}
              </select>
              {formik.errors.studyLevelId && formik.touched.studyLevelId && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.studyLevelId}</p>)}

              <label className="font-semibold text-sm text-gray-600 pb-1 block"> الترم</label>
              <select name="semesterId" value={formik.values.semesterId} onChange={formik.handleChange} onBlur={formik.handleBlur} className={selectClass}>
                <option value="">اختر الترم</option>
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>{semester.name}</option>
                ))}
              </select>
              {formik.errors.semesterId && formik.touched.semesterId && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.semesterId}</p>)}

              <label className="font-semibold text-sm text-gray-600 pb-1 block">الصورة الشخصية</label>
              <input
                type="file"
                name="photoPath"
                onChange={(e) => formik.setFieldValue("photoPath", e.currentTarget.files[0])}
                className={inputClass}
              />
              {formik.errors.photoPath && formik.touched.photoPath && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.photoPath}</p>)}

              <label className="font-semibold text-sm text-gray-600 pb-1 block">التقرير الطبي</label>
              <input
                type="file"
                name="medicalReports"
                onChange={(e) => formik.setFieldValue("medicalReports", e.currentTarget.files[0])}
                className={inputClass}
              />
              {formik.errors.medicalReports && formik.touched.medicalReports && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.medicalReports}</p>)}

              <label className="font-semibold text-sm text-gray-600 pb-1 block">آخر مؤهل دراسي</label>
              <input
                type="file"
                name="lastEducationalQualifications"
                onChange={(e) => formik.setFieldValue("lastEducationalQualifications", e.currentTarget.files[0])}
                className={inputClass}
              />
              {formik.errors.lastEducationalQualifications && formik.touched.lastEducationalQualifications && (<p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.lastEducationalQualifications}</p>)}

              <button
                type="submit"
                className="transition duration-200 bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 focus:ring-4 focus:ring-blue-500 text-white w-full py-2.5 rounded-lg text-sm shadow-sm font-semibold"
              >
                <span className="inline-block ml-2">تسجيل</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </form>

          <div className="py-5">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-center sm:text-left whitespace-nowrap">
                <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400">
                  نسيت كلمة المرور؟
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CreateDisChild;
