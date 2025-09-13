import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ParentInfo from "../../components/parent/ParentInfo";
import ChildCard from "../../components/parent/Child"; // تأكدي من اسم الملف
import { BASE_URL } from "../../api/BASE_URL";

export default function ParentProfile() {
  const token = useSelector((s) => s.auth.token);
  const { id } = useSelector((s) => s.auth);
  const [profile, setProfile] = useState(null);
  const [childrenData, setChildrenData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/Parent/profile/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(data);
        setChildrenData(data?.children || []);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [id, token]);

  return (
    // خلفية محايدة فقط – مفيش أورانج/أزرق برا الكارد
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8 py-10">
        {/* كارت معلومات وليّ الأمر */}
        <ParentInfo parent={profile} />

        {/* الأبناء تحت الكارت */}
        <section dir="rtl" className="mt-8">
          <header className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">الأبناء</h3>
          </header>

          {childrenData?.length ? (
            <div className="grid grid-cols-12 gap-5">
              {childrenData.map((item) => (
                <ChildCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-slate-600">
              لا يوجد أبناء
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
