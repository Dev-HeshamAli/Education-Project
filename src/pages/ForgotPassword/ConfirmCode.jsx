// 📁 components/ForgotPassword.jsx
import axios from 'axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { setCode } from '../../store/resetPassword/resetPasswordSlice';
import Navbar from '../../components/main/Navbar';
import Footer from "../../components/main/Footer";


function ConfirmCode() {
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = useSelector((state) => state.resetPassword.email);

  const BASE_URL = 'https://edu-smart.runasp.net/api/Auth';

  const handleCodeChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // مسموح أرقام فقط
    const updatedDigits = [...codeDigits];
    updatedDigits[index] = value;
    setCodeDigits(updatedDigits);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleConfirmCode = async () => {
    const code = codeDigits.join('');
    if (code.length < 6) {
      alert("⚠️ من فضلك أدخل كل الأرقام الستة.");
      return;
    }

    dispatch(setCode(code)); // حفظ الكود في الكونتكست

    try {
      await axios.post(`${BASE_URL}/Get-Code-For-Reset-Password?Email=${email}&code=${code}`);
      alert('✅ الكود صحيح.');
      navigate('/reset-password');
    } catch (err) {
      alert('❌ الكود غير صحيح.');
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col max-w-md mx-auto mt-24 p-6 bg-white shadow-lg rounded-xl gap-4">
        <h1 className="text-2xl font-bold text-center">تأكيد الكود</h1>

        <div className="flex justify-between gap-2">
          {codeDigits.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleCodeChange(idx, e.target.value)}
              ref={(el) => (inputsRef.current[idx] = el)}
              className="w-10 h-12 text-center text-lg border border-gray-300 rounded"
            />
          ))}
        </div>

        <button
          className="bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 mt-4"
          onClick={handleConfirmCode}
        >
          تأكيد الكود
        </button>
      </div>
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

export default ConfirmCode;
