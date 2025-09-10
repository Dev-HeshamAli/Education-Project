import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setEmail } from '../../store/resetPassword/resetPasswordSlice';
import Navbar from '../../components/main/Navbar';

function ForgotPassword() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const email = useSelector((state) => state.resetPassword.email);


  const BASE_URL = 'https://edu-smart.runasp.net/api/Auth';

  const handleForgetPassword = async () => {
    try {
      await axios.post(`${BASE_URL}/Forget-Password?Email=${email}`);
      alert('Confirmation code sent to your email.');
      navigate('/confirm-code')
    } catch (err) {
      alert('Error sending code.');
      console.error(err);
    }
  };


  return (
    <>
    <Navbar/>
    <div className="flex flex-col max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl gap-4">
      <h1 className="text-2xl font-bold text-center">🔐 Forgot Password</h1>

          <input
            type="email"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
            className="border rounded-md p-2"
            placeholder="Enter your email"
          />
          <button
            className="bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700"
            onClick={handleForgetPassword}
          >
            Send Confirmation Code
          </button>
       
      

     
    </div>
    </>
  );
}

export default ForgotPassword;