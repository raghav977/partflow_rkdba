import CustomerAddForm from '@/components/form/CustomerAddForm'
import Header from '@/components/Header'
import useAddCustomer from '@/hooks/UseAddCustomer'
import React from 'react'

const AddNewCustomerStaff = () => {

    const {mutate,isPending} = useAddCustomer();

    const handleSubmit = (data)=>{
        console.log("New Customer Data:",data);
        mutate(data);
    }
  return (
    <div>
        <Header title="Add New Customer" desc="Fill in the details to add a new customer" backLink="/staff/customers"/>
        <CustomerAddForm onSubmit={handleSubmit} isPending={isPending} />
    </div>
  )
}

export default AddNewCustomerStaff