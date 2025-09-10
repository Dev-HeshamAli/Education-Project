import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../../components/main/Navbar';

function ResetPassword() {
  const email = useSelector((state) => state.resetPassword.email);
  const code = useSelector((state) => state.resetPassword.code);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const BASE_URL = 'https://edu-smart.runasp.net/api/Auth';
  
  

  const handleResetPassword = async () => {
    try {
      await axios.post(`${BASE_URL}/Reset-Password`, {
        email,
        newPassword,
        confirmCode: code,
        confirmPassword,
      });
      alert('Password reset successful.');
    } catch (err) {
      alert('Password reset failed.');
      console.error(err);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="flex flex-col max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl gap-4">
      <h1 className="text-2xl font-bold text-center">🔐 Forgot Password</h1>

     
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border rounded-md p-2"
            placeholder="New password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded-md p-2"
            placeholder="Confirm new password"
          />
          <button
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            onClick={handleResetPassword}
          >
            Reset Password
          </button>
       
    </div>
    </>
  );
}

export default ResetPassword;