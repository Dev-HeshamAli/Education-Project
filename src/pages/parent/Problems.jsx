import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import toast from "react-hot-toast";
import ProblemCard from "../../components/parent/ProblemCard";
import { BASE_URL } from "../../api/BASE_URL";

function Problems() {
    const [problems, setProblems] = useState(null);
    const token = useSelector((state) => state.auth.token);
   
    async function getProblems(){
           try{
               let {data} =  await axios.get(`${BASE_URL}/api/ContactUs/Get-user-problems`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
               )
              
               setProblems(data)
              
           }
           catch(err){
           
           }
           
       }
   

   async function handleDelete(id) {
    try {
      await axios.delete(
        `${BASE_URL}/api/ContactUs/Delete-problem/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // شيل العنصر محليًا (بدون ريفريش)
      setProblems((prev) => prev.filter((p) => p.id !== id));
      toast.success("تم حذف المشكلة!");
    } catch (err) {
   
      toast.error("فشلت عملية الحذف");
    }
  }

   useEffect(() => {
        getProblems();
       }, []);
        
  return (
     <div className="flex justify-center  bg-gray-100 ">
         <div className="container  pt-[80px] pb-[320px] max-md:pb-[380px] max-w-7xl max-xl:px-10">
             
           
             { 
                problems?.map((item)=>
                    (
                      <ProblemCard 
                         key={item.id}           // ✅ مهم جدًا
                         problem={item}
                         onDelete={handleDelete} // ✅ مرري كولباك
                      />
                    )
                )
             }
    </div>
    </div>
  )
}

export default Problems