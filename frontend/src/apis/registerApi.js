import api from '@/lib/api';
import axios from 'axios';



const API_BASE_URL = import.meta.env.VITE_API_URL


export const registerUser = {
    registerStaff: async(staffData)=>{
        
            const response = await api.post('/User/add-staff',staffData);
            console.log("this is response",response.data);
            return response.data;

    },

    addCustomer:async(customerData)=>{
        const response = await api.post('/User/add-customer',customerData);
        console.log("this is response",response.data);
        return response.data;
    }

}