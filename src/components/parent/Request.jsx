import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setRequestDetails, setRequestStudentID } from "../../store/parent/parentSlice";

function Request({ request, onDelete }) {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const { id } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  console.log("parentID:", id);

  async function ShowRequest(studentid) {
    try {
      const { data } = await axios.get(
        `https://edu-smart.runasp.net/api/Parent/student-application-info/${studentid}/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setRequestDetails(data));
      dispatch(setRequestStudentID(id));
      navigate("/parent/request-info");
    } catch (err) {
      console.log(err);
    }
  }

  const statusText = "قيد المراجعة";
  const statusClass = "text-yellow-600";

  return (
    <article dir="rtl" className="grid grid-cols-12 gap-6 border-b-2 border-gray-300 pb-8 pt-4 mx-auto max-w-7xl max-xl:px-10 border-1">
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
      <div className="text-right col-span-8 md:col-span-9 lg:col-span-10 flex max-lg:flex-col justify-center items-start md:items-center order-2">
        
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

        <div className="flex max-xs:flex-wrap justify-between items-center w-full">
          {/*<div className="flex justify-center items-center border-2 rounded-2xl px-4 py-1 md:py-2 gap-5">
            <span className="text-sm text-gray-600">رقم الطلب</span>
            <span className="font-bold">{request?.id}</span>
          </div>*/}

          <button
            className="group max-xs:order-first order-last"
            onClick={() => onDelete(request?.id)}
          >
            <i className="fa-solid fa-xmark text-base flex border-2 border-transparent hover:text-red-600 hover:border-red-600 size-1 justify-center items-center p-3 rounded-full group-hover:rotate-90 duration-300 text-gray-500"></i>
          </button>
        </div>

        <div className="mt-3 flex gap-2 w-full">
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
