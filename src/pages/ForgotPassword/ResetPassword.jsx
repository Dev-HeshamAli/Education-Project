// 📁 components/ResetPassword.jsx
import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Footer from "../../components/main/Footer";
import Navbar from '../../components/main/Navbar';
// ✅ استخدم الـ BASE_URL الموحد
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/BASE_URL";


function ResetPassword() {
  const email = useSelector((state) => state.resetPassword.email);
  const code = useSelector((state) => state.resetPassword.code);
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert('⚠️ من فضلك أدخل كلمة المرور الجديدة والتأكيد.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('⚠️ كلمتا المرور غير متطابقتين.');
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/Auth/Reset-Password`, {
        email,
        newPassword,
        confirmCode: code,
        confirmPassword,
      });
       navigate('/login');
    } catch (err) {
     // toast('❌ فشل في إعادة تعيين كلمة المرور.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col max-w-md mx-auto min-h-[50vh] p-6 bg-white shadow-lg rounded-xl gap-4">
        <h1 className="text-2xl font-bold text-center">🔐 إعادة تعيين كلمة المرور</h1>

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border rounded-md p-2"
          placeholder="كلمة المرور الجديدة"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border rounded-md p-2"
          placeholder="تأكيد كلمة المرور الجديدة"
        />

        <button
          className="bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? 'جارٍ التنفيذ...' : 'إعادة التعيين'}
        </button>
      </div>

      <div className="relative">
        <Footer />
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 py-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center">
              <p className="text-gray-300 text-sm leading-relaxed">
                حقوق النشر © 2025 Edu-Smart. جميع الحقوق محفوظة بواسطة{" "}
                <a
                  href="https://edu-smart.ai"
                  className="text-orange-500 hover:text-orange-400 transition-colors duration-300 font-semibold hover:underline"
                >
                  Edu-Smart.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
