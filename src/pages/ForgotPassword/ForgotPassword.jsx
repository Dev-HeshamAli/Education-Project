import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setEmail } from '../../store/resetPassword/resetPasswordSlice';
import Navbar from '../../components/main/Navbar';
import Footer from "../../components/main/Footer";
import { useState } from 'react';

function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = useSelector((state) => state.resetPassword.email);
  const [loading, setLoading] = useState(false);

  const BASE_URL = 'https://edu-smart.runasp.net/api/Auth';

  const validateEmail = (val) =>
    !!val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleForgetPassword = async () => {
    if (!validateEmail(email)) {
      window.alert('من فضلك أدخل بريدًا إلكترونيًا صالحًا.');
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/Forget-Password?Email=${encodeURIComponent(email)}`);
      window.alert('تم إرسال رمز التأكيد إلى بريدك الإلكتروني.');
      navigate('/confirm-code');
    } catch (err) {
      console.error(err);
      window.alert('حدث خطأ أثناء إرسال الرمز. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-[#051441] mb-2">
            🔐 نسيت كلمة المرور
          </h1>
          <p className="text-center text-gray-600 mb-6">
            أدخل بريدك الإلكتروني لإرسال رمز التأكيد لإعادة التعيين.
          </p>

          <label htmlFor="email" className="block mb-2 font-semibold text-[#051441]">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="اكتب بريدك الإلكتروني"
            autoComplete="email"
            dir="ltr"
            inputMode="email"
          />

          <button
            className="mt-5 w-full bg-orange-600 text-white py-2.5 rounded-md font-bold hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleForgetPassword}
            disabled={loading}
          >
            {loading ? 'جاري الإرسال...' : 'إرسال رمز التأكيد'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-3 w-full text-orange-600 hover:text-orange-700 font-semibold"
          >
            الرجوع لتسجيل الدخول
          </button>
        </div>
      </main>
      <div className="relative">
             <Footer />
             
             {/* Enhanced Copyright Section */}
             <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 py-6 text-white relative overflow-hidden">
               {/* Background pattern */}
               <div className="absolute inset-0 opacity-10">
                 <div className="absolute top-0 left-1/4 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                 <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
               </div>
               
               <div className="container mx-auto px-4 relative">
                 <div className="text-center">
                    <p className="text-gray-300 text-sm leading-relaxed">
                     حقوق النشر © 2024 Edu-Smart. جميع الحقوق محفوظة بواسطة{" "}
                     <a
                       href="https://envytheme.com/"
                       target="_blank"
                       rel="noopener noreferrer"
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

export default ForgotPassword;
