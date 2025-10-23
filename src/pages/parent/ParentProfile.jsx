import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ParentInfo from "../../components/parent/ParentInfo";
import ChildCard from "../../components/parent/ChildCard";
import { BASE_URL } from "../../api/BASE_URL";
import { Link } from "react-router-dom";

export default function ParentProfile() {
  const token = useSelector((s) => s.auth.token);
  const { id } = useSelector((s) => s.auth);
  const [profile, setProfile] = useState(null);
  const [childrenData, setChildrenData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}/api/Parent/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(data);
        setChildrenData(data?.children || []);
       
      } catch (err) {
       
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchProfile();
    }
  }, [id, token]);

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8 py-10">
        {/* كارت معلومات وليّ الأمر */}
        <ParentInfo parent={profile} isLoading={loading} />

        {/* قسم الأبناء */}
        <section dir="rtl" className="mt-8">
          <header className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900">الأبناء</h3>
            <span className="text-sm text-slate-600">
              {childrenData.length > 0 ? `${childrenData.length} طالب` : ""}
            </span>
          </header>

          {loading ? (
            // Loading state للأبناء
            <div className="grid grid-cols-12 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3">
                  <div className="h-80 bg-white rounded-2xl border border-neutral-200 animate-pulse">
                    <div className="bg-slate-200 h-36 rounded-t-2xl"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      <div className="space-y-2 mt-4">
                        <div className="h-10 bg-slate-200 rounded-lg"></div>
                        <div className="h-10 bg-slate-200 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : childrenData?.length > 0 ? (
            <div className="grid grid-cols-12 gap-5">
              {childrenData.map((child) => (
                <ChildCard key={child.id} child={child} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">لا يوجد أبناء مسجلون</h4>
              <p className="text-slate-600 mb-4">لم يتم تسجيل أي أبناء في حسابك حتى الآن</p>
              <Link to="create-child" className="inline-flex items-center px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg text-sm font-semibold transition-colors">
                إضافة طالب جديد
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}