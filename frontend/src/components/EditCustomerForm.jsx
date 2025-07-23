import React, { useState } from 'react';
import axios from 'axios';
import Selector from './Selector';
import Swal from 'sweetalert2';

const AddressInput = ({ address, setAddress, label, required = true }) => {
  const handleChange = (field, value) => {
    const newAddress = {
      ...address,
      [field]: value,
    };
    setAddress(newAddress);
  };

  return (
    <div className="admin__form__review__att">
      {required ? (
        <label>
          <span className="red">*</span> {label}
        </label>
      ) : (
        <label>{label}</label>
      )}
      <div className="admin__form__review__att__rating__addy">
        {['street', 'city', 'state', 'zipCode', 'country'].map((field) => (
          <div className="admin__form__review__att__rating__addy" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type="text"
              placeholder={`Enter ${field}`}
              value={address[field] || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              required={required}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const EditCustomerForm = ({ customer }) => {
  const [formData, setFormData] = useState({
    userId: customer.userId,
    email: customer.email,
    firstName: customer.firstName,
    lastName: customer.lastName,
    decryptedPassword: '',
    address: customer.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    isSubscriber: customer.isSubscriber ? 'TRUE' : 'FALSE',
    status: customer.status,
    role: customer.role,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (newAddress) => {
    setFormData((prev) => ({ ...prev, address: newAddress }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/customers/${formData.userId}`, formData);
      Swal.fire({
        icon: 'success',
        title: 'Customer Updated Successfully',
        confirmButtonColor: '#e50914',
      });
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        confirmButtonColor: '#e50914',
      });
    }
  };

  return (
    <div className="admin__edit__customer__form">
      <h2>Edit Customer</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>First Name:</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />

        <label>Last Name:</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />

        <label>New Password (optional):</label>
        <input type="password" name="decryptedPassword" value={formData.decryptedPassword} onChange={handleChange} />

        <AddressInput address={formData.address} setAddress={handleAddressChange} label="Home Address" />

        <label>Subscriber:</label>
        <Selector
          options={['TRUE', 'FALSE']}
          selectedValue={formData.isSubscriber}
          onChange={(val) => setFormData((prev) => ({ ...prev, isSubscriber: val }))}
          name="isSubscriber"
        />

        <label>Status:</label>
        <Selector
          options={['ACTIVE', 'SUSPENDED']}
          selectedValue={formData.status}
          onChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}
          name="status"
        />

        <button type="submit" className="admin__edit__submit__btn">Update</button>
      </form>
    </div>
  );
};

export default EditCustomerForm;
