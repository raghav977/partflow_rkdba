import React, { useState } from 'react';

const AddNewCustomer = () => {
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleAdd = (e) => {
    e.preventDefault();
    // Add customer logic
  };

  return (
    <div className="add-customer-admin-container">
      <h2>Add New Customer (Admin)</h2>
      <form onSubmit={handleAdd}>
        <input placeholder="Name" />
        <input placeholder="Email" />
        <input placeholder="Phone" />
        <input placeholder="Address" />
        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
};

export default AddNewCustomer;
