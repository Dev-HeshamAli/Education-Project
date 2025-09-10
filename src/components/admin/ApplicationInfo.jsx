import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ApplicationInfo({request}) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const userInfo = useSelector((state) => state.auth.userData);
  const requestDetails = useSelector((state) => state.parent.requestDetails);
  const navigate = useNavigate()

  //const {requestdata , setRequestData} =useContext(AuthContext)
  //const {setRequestDataId} =useContext(AuthContext)

  
  async function deleteRequest(studentid){

        try{
            let {data} =  await axios.delete(`https://edu-smart.runasp.net/api/Parent/Delete-student-application/${studentid}`,
               {},
               {
                  headers: {
                      Authorization: `Bearer ${token}`
                  },
              }
            )
            console.log(data)
        }
        catch(err){
            console.log(err)
            console.log("ID:", id); 
        }
        
  }


  async function AcceptRequest(id){
    console.log(token)
        try{
            let {data} =  await axios.put(`https://edu-smart.runasp.net/api/Admin/Acceptance-Application/${id}`,
                 {},
                { 
                  
                  headers: {
                      Authorization: `Bearer ${token}`
                  },
              }
            )
            console.log(data)
            //dispatch(setRequestDetails(data));
            //dispatch(setRequestStudentID(id));
            //setRequestData(data)
            //setRequestDataId(id)
            //navigate('/parent/request-info')
        }
        catch(err){
            console.log(err)
            console.log("ID:", id); 
        }
        
  }
  return (
    
    <div className="col-span-12  w-full mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-500 hover:-translate-y-1">
  <div className="flex items-center p-4">
    <img
      src={request?.photo}
      alt="Child"
      className="w-20 h-20 rounded-full border-2 border-blue-500 object-cover"
    />
    <div className="ml-4">
      <h2 className="text-xl font-bold text-gray-800">{request?.name}</h2>
      <p className="text-gray-600"><span className="font-semibold">Stage: </span>{request?.stage}</p>
      <p className="text-gray-600"><span className="font-semibold">Study Level: </span>{request?.study_Level}</p>
    </div>
  </div>

  <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-between">
    <span className="text-yellow-600 font-medium">Pending Review</span>
    <div className="flex gap-2">
          <button
             onClick={()=>{AcceptRequest(request?.id)}}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
          >
              Accept
          </button>
          <button
            onClick={()=>{deleteRequest(request?.id)}}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
          >
              Reject
          </button>
        </div>

  </div>
    </div>
    
  )
}

export default ApplicationInfo