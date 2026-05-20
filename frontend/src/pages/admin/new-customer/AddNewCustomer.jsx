import CustomerAddForm from '@/components/form/CustomerAddForm'
import Header from '@/components/Header'
import useAddCustomer  from '@/hooks/UseAddCustomer'
import React from 'react'

const AddNewCustomer = () => {
  const {mutate,isPending}=useAddCustomer();
  const handleAddCustomer = (customerData) => {
    // Handle the form submission logic here, e.g., send data to the server
    console.log('New Customer Data:', customerData);
    mutate(customerData);
  }


  return (
    <div>
        <Header title="Add new Customer" backLink="/admin/customers" desc="Create the new customers for your business"></Header>

        <CustomerAddForm onSubmit={handleAddCustomer} isPending={isPending}/>
    </div>
  )
}

export default AddNewCustomer