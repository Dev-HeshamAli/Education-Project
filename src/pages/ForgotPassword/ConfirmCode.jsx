// 📁 components/ForgotPassword.jsx
import axios from 'axios';
import {useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';


import { useSelector, useDispatch } from 'react-redux';
import {setCode } from '../../store/resetPassword/resetPasswordSlice';
import Navbar from '../../components/main/Navbar';

function ConfirmCode() {
  
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const email = useSelector((state) => state.resetPassword.email);

  const BASE_URL = 'https://edu-smart.runasp.net/api/Auth';

  const handleCodeChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits
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
      alert("Please enter all 6 digits.");
      return;
    }

   dispatch(setCode(code)); // save in context

    try {
      await axios.post(`${BASE_URL}/Get-Code-For-Reset-Password?Email=${email}&code=${code}`);
      alert('✅ Code verified successfully.');
      navigate('/reset-password');
    } catch (err) {
      alert('❌ Invalid code.');
      console.error(err);
    }
  };

  return (
    <>
      <Navbar/>
     
    <div className="flex flex-col max-w-md mx-auto mt-24 p-6 bg-white shadow-lg rounded-xl gap-4">
      <h1 className="text-2xl font-bold text-center"> Confirm Code</h1>

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
        className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-4"
        onClick={handleConfirmCode}
      >
        Verify Code
      </button>
    </div>
     </>
  );
}

export default ConfirmCode;
