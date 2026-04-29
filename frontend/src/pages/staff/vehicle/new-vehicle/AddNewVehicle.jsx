import VehicleAddForm from '@/components/form/VehicleAddForm'
import Header from '@/components/Header'
import useAddVehicle from '@/hooks/UseVehicleregister';
import React from 'react'
import { useParams } from 'react-router-dom';

const AddNewVehicle = () => {
    const { customerId } = useParams();
    console.log('Customer ID from URL:', customerId); 
    const {mutate,isPending } = useAddVehicle();

    const handleSubmit = (vehicleData) => {
        // Handle the forma submission logic here, e.g., send data to the server
        console.log('New Vehicle Data:', vehicleData);
        try{
            mutate(vehicleData);
            console.log('Vehicle added successfully:', response);
        }
        catch(err){
            console.error('Error adding vehicle:', err);
        }
    }
    // Debugging log to check if customerId is being captured
  return (
    <div>
      <Header title="Add New Vehicle" desc="Fill in the details to add a new vehicle" buttonText='Save Vehicle' backLink='/staff/vehicles' />
      <VehicleAddForm customerId={customerId}  onSubmit={handleSubmit} isPending={isPending}/>
    </div>
  )
}

export default AddNewVehicle