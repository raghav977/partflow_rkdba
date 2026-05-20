import {useMutation} from '@tanstack/react-query'
import { registerUser } from '@/apis/registerApi'
import { toast } from 'react-toastify'
const useAddCustomer = () => {
  return useMutation(
    {
        mutationFn: registerUser.addCustomer,

        onSuccess:(data)=>{
            console.log("THis is success data",data);
            toast.success("Customer added successfully");

        },
        onError:(error)=>{
            
            toast.error(error.response.data.message || "An error occurred")


        }
    }
  )
}

export default useAddCustomer