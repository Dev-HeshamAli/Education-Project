import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Request from '../../components/parent/Request';
import { BASE_URL } from "../../api/BASE_URL";

function Requests() {
     const token = useSelector((state) => state.auth.token);
     const {id} = useSelector((state) => state.auth);
     const [requests, setRequests] = useState(null);
     useEffect(() => {
      getApplications();
     }, []);

     async function getApplications(){
        try{
            let {data} =  await axios.get(`${BASE_URL}/api/Parent/student-applications/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            )
            setRequests(data)
        }
        catch(err){
         
        }
        
    }
     async function deleteRequest(studentid){
            try{
                let {data} =  await axios.delete(`${BASE_URL}/api/Parent/Delete-student-application/${studentid}/${id}`,
                  { 
                      headers: {
                          Authorization: `Bearer ${token}`
                      },
                  }
                )
              
                setRequests((prev) => prev.filter((p) => p.id !== id));
                toast.success("تم حذف الطلب");
            }
            catch(err){
                toast.error("Delete failed"); 
            }
            
      }
  return (
   <section>
  <div className="container bg-gray-100 rounded-3xl py-2 px-3">
    <header className="flex max-xs:flex-col justify-center items-center gap-4 px-2 my-4">
      <div className="flex items-center gap-6">
        <h2 className="flex items-center gap-2">
          <span className="text-2xl font-bold">طلبات انشاء حساب ابناء</span>
          <i className="fa-solid fa-file-lines fa-lg text-green-500"></i>
        </h2>
      </div>
    </header>

    <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8 py-10">
      <div>

        {  (requests && requests.length > 0)?
                 requests?.map((item)=>
                  (<Request  request={item}
                       key={item.id}
                        onDelete={deleteRequest}/>))
                 :
                    <div className="col-span-12 text-center text-gray-500">لا يوجد طلبات</div>
        }
       
      </div>
    </div>
  </div>
</section>

  )
}

export default Requests