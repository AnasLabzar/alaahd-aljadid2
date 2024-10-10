import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerSelect = ({ onCustomerChange }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users'); // Fetch all users
        const customRoleUsers = response.data.filter(user => user.role === 'custom'); // Filter by role 'custom'
        setCustomers(customRoleUsers); // Set the filtered users
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
  
    fetchCustomers();
  }, []);  

  const handleCustomerChange = (event) => {
    const customerId = event.target.value;
    setSelectedCustomer(customerId);
    onCustomerChange(customerId);
  };

  return (
      <select
        value={selectedCustomer}
        onChange={handleCustomerChange}
        className="form-input lg:w-[250px] w-2/3"
      >
        <option value="" disabled defaultChecked>
          Selection client
        </option>
        {customers.map((customer) => (
          <option key={customer._id} value={customer._id}>
            {customer.username} {/* Display the customer's name */}
          </option>
        ))}
      </select>
  );
};

export default CustomerSelect;
