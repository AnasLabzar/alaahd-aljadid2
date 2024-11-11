import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Customer {
    _id: string; // Assuming _id is the unique identifier
    username: string; // Assuming username is the property to display
}

interface CustomerSelectProps {
    onCustomerChange: (customerId: string) => void; // Correct the spelling from onCustomerChangem to onCustomerChange
    id?: string; // Add an optional id prop
}

const CustomerSelect: React.FC<CustomerSelectProps> = ({ onCustomerChange, id }) => {
    const [customers, setCustomers] = useState<Customer[]>([]); // Specify the Customer type
    const [selectedCustomer, setSelectedCustomer] = useState<string>('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('https://backendalaahd.onrender.com/api/users/customer');
                // const customRoleUsers = response.data.filter((user: any) => user.role === 'custom'); // Type the response if possible
                setCustomers(response.data); 
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };
    
        fetchCustomers();
    }, []);

    const handleCustomerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const customerId = event.target.value;
        setSelectedCustomer(customerId);
        onCustomerChange(customerId); // Call the passed function with the selected customer ID
    };

    return (
        <select
            value={selectedCustomer}
            onChange={handleCustomerChange}
            className="form-input lg:w-[250px] w-2/3"
            id={id} // Add the id prop to the select element if needed
        >
            <option value="" disabled defaultChecked>
                Selection client
            </option>
            {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                    {customer.username}
                </option>
            ))}
        </select>
    );
};

export default CustomerSelect;
