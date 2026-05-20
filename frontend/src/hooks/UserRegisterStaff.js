import {useMutation} from '@tanstack/react-query'
import { registerUser } from '@/apis/registerApi'
import { toast } from 'react-toastify'
const useRegisterStaff = () => {
  return useMutation(
    {
        mutationFn: registerUser.registerStaff,

        onSuccess:(data)=>{
            console.log("THis is success data",data);
            toast.success("Staff registered successfully");
            
        },
        onError:(error)=>{
            
            toast.error(error.response.data.message || "An error occurred")


        }
    }
  )
}

export default useRegisterStaff