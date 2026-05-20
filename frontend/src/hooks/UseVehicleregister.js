import {useMutation} from '@tanstack/react-query'
import { vehicleApi } from '@/apis/vehicleApi'
import { toast } from 'react-toastify'


const useAddVehicle = () => {
  return useMutation(
    {
        mutationFn: (vehicleData) => vehicleApi.addVehicle(vehicleData),

        onSuccess:(data)=>{
            console.log("THis is success data",data);
            toast.success("Vehicle added successfully");
            
        },
        onError:(error)=>{
            console.log("This is error data",error);
            toast.error(error.response.data.message || "An error occurred")
        }
    }
)
}

export default useAddVehicle