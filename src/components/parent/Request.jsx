// src/components/parent/Request.jsx  (أو حسب مسارك)
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setRequestDetails, setRequestStudentID } from "../../store/parent/parentSlice";
import { BASE_URL } from "../../api/BASE_URL"; 

function Request({ request, onDelete }) {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const { id } = useSelector((s) => s.auth); // parent id (للمراجعة/الـ logging لو محتاجه)
  const navigate = useNavigate();
  async function ShowRequest(studentid) {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/Parent/student-application-info/${studentid}/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setRequestDetails(data));
      dispatch(setRequestStudentID(studentid)); // ✅ منطقيًا ده هو المطلوب
      navigate("/parent/request-info");
    } catch (err) {
  
    }
  }

  const statusText = "قيد المراجعة";
  const statusClass = "text-yellow-600";

  return (
    <article
      dir="rtl"
      className="grid grid-cols-12 gap-6 border-b-2 border-gray-300 pb-8 pt-4 mx-auto max-w-7xl max-xl:px-10 border-1"
    >
      {/* صورة الطالب — تيجي أول عمود من اليمين */}
      <div className="col-span-4 md:col-span-3 lg:col-span-2 order-1">
        <div className="rounded-3xl border-2 border-gray-300 overflow-hidden">
          <img
            src={request?.photo}
            alt="صورة الطالب"
            className="w-full rounded-3xl object-cover"
          />
        </div>
      </div>

      {/* بيانات الطالب + الأزرار — تيجي على الشمال */}
      <div className="text-right col-span-8 md:col-span-9 lg:col-span-10 flex max-lg:flex-col items-start md:items-center gap-3 order-2">
  <div className="flex flex-col gap-1 w-full">
    <h2 className="font-bold text-xl">{request?.name}</h2>

    <div className="text-gray-700">
      <span className="ml-1">المرحلة الدراسية:</span>
      <bdi>{request?.stage}</bdi>
    </div>

    <div className="text-gray-700">
      <span className="ml-1">الصف الدراسي:</span>
      <bdi>{request?.study_Level}</bdi>
    </div>

    <div className={`${statusClass} font-medium`}>{statusText}</div>
  </div>

  {/* أزرار التحكم — تروح لأقصى الشمال على الشاشات المتوسطة وفوق */}
  <div className="mt-3 flex gap-2 w-full md:w-auto md:ml-auto md:justify-end">
    <button
      onClick={() => ShowRequest(request?.id)}
      className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-950 transition"
    >
      عرض
    </button>
    <button
      onClick={() => onDelete(request?.id)}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
    >
      حذف
    </button>
  </div>
</div>

    </article>
  );
}

export default Request;
