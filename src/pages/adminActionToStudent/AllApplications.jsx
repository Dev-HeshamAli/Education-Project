import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ApplicationInfo from "../../components/admin/ApplicationInfo";

function AllApplications() {
  const token = useSelector((state) => state.auth.token);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getApplications();
  }, []);

  async function getApplications() {
    try {
      let { data } = await axios.get(
        `https://edu-smart.runasp.net/api/Admin/All-Applications?PageNumber=1&PageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests(data?.items || []);
    } catch (err) {
      console.log(err);
    }
  }

  // 🟢 دالة الحذف
  async function handleDelete(id) {
    try {
      await axios.delete(
        `https://edu-smart.runasp.net/api/Admin/Delete-Application/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // تحديث الـ state محليًا
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  // 🟢 دالة القبول
  async function handleAccept(id) {
    try {
      await axios.put(
        `https://edu-smart.runasp.net/api/Admin/Accept-Application/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // تحديث محلي (مثلاً تغيير الحالة بدل ما نمسحه)
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: "Accepted" } : req
        )
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex justify-center bg-gray-100">
      <div className="container pt-[80px] pb-[320px] max-md:pb-[380px] max-w-6xl max-xl:px-10">
        <section className="grid grid-cols-12 gap-9">
          {requests && requests.length > 0 ? (
            requests.map((item) => (
              <ApplicationInfo
                key={item.id}
                request={item}
                onDelete={handleDelete}
                onAccept={handleAccept}
              />
            ))
          ) : (
            <div className="col-span-12 text-center text-gray-500">
              No applications found
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AllApplications;
