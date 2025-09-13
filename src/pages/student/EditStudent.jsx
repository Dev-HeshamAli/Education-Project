import axios from "axios";
import { useFormik } from 'formik';
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { fetchStudentInfo } from '../../store/student/studentSlice';
import { BASE_URL } from "../../api/BASE_URL";

function EditStudent() {

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const {id} = useSelector((state) => state.auth);
  const studentId = id;
  const studentinfo = useSelector((state) => state.student.studentinfo);

 console.log(studentId)
    console.log(studentinfo)
  useEffect(() => {
     if (studentId && token) {
        dispatch(fetchStudentInfo({ studentId, token }));
      }
  }, [dispatch, studentId, token]);



 const validationSchema = Yup.object({
  firstName: Yup.string().required('الاسم الأول مطلوب'),
  country: Yup.string().required('الدولة مطلوبة'),
  governorate: Yup.string().required('المحافظة مطلوبة'),
  email: Yup.string().email('البريد الإلكتروني غير صالح'),
  password: Yup.string()
    .matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, 'كلمة المرور يجب أن تحتوي على حرف كبير ورقم على الأقل وطولها لا يقل عن 8')
    .nullable(),
  photoPath: Yup.mixed().nullable(),
});


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: studentinfo?.firstName || "",
      secondName: studentinfo?.secondName || "",
      thirdName: studentinfo?.thirdName || "",
      country: studentinfo?.country || "",
      governorate: studentinfo?.governorate || "",
      email: studentinfo?.email || "",
      password: studentinfo?.password || "",
      photoPath: null,
    },
    validationSchema,
    onSubmit: (values) =>{ 
                    console.log("heshhaaaaaaaaaaaaaaaaaaaaaaaaam")

      editChild(values)
                    console.log("heshhaaaaaaaaaaaaaaaaaaaaaaaaam")

    }
  });


 async function editChild(values) {
  console.log(">>> ENTER editChild");
  const loadingToast = toast.loading("جارٍ التحديث...");
  try {
    const formData = new FormData();
    formData.append("Id", studentId); // ✅ لازم Id
    formData.append("FirstName", values.firstName);
    formData.append("Governorate", values.governorate);
    formData.append("Country", values.country);

    if (values.email) formData.append("Email", values.email);
    if (values.password) formData.append("Password", values.password);
    if (values.photoPath) formData.append("PhotoPath", values.photoPath);

    await axios.put(
      `${BASE_URL}/api/Student/Update-student`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ مهم لو الـ API محمي
        }
      }
    );

    toast.success("تم تحديث بيانات الطالب بنجاح");
  } catch (err) {
    console.log(">>> ERROR in editChild:", err);
    console.log("أخطاء التحقق:", err?.response?.data?.errors);
    toast.error(err?.response?.data?.message || "حدث خطأ أثناء التحديث");
  } finally {
    toast.dismiss(loadingToast);
  }
}


  return (
    <div className="flex flex-col justify-center sm:py-12 mt-10" dir="rtl">
      <div className="shadow-2xl p-10 xs:p-0 mx-auto max-w-2xl bg-white rounded-2xl">
        <h1 className="font-bold text-center text-2xl mb-5">تعديل بيانات الطالب</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="px-5 py-7">
            {[
              { label: "الاسم الأول", name: "firstName" },
              { label: "الاسم الثاني", name: "secondName" },
              { label: "الاسم الثالث", name: "thirdName" },
              { label: "المحافظة", name: "governorate" },
              { label: "الدولة", name: "country" },
              { label: "البريد الإلكتروني", name: "email" },
              { label: "كلمة المرور", name: "password", type: "password" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="font-semibold text-sm text-gray-600 pb-1 block">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formik.values[name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />
                {formik.errors[name] && formik.touched[name] && (
                  <p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors[name]}</p>
                )}
              </div>
            ))}

            <label className="font-semibold text-sm text-gray-600 pb-1 block">الصورة الشخصية</label>
            <input
              type="file"
              name="photoPath"
              onChange={(e) => formik.setFieldValue("photoPath", e.currentTarget.files[0])}
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            />
            {formik.errors.photoPath && formik.touched.photoPath && (
              <p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.photoPath}</p>
            )}

            <button
              type="submit"
              className="transition duration-200 bg-slate-800 hover:bg-slate-900 text-white w-full py-2.5 rounded-lg text-sm font-semibold"
            
            >
              تحديث
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStudent;
