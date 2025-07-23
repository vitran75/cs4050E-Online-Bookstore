import React, { useState } from 'react';
import axios from 'axios';
import Selector from './Selector';
import Swal from 'sweetalert2';

const AddressInput = ({ address, setAddress, label, required = true }) => {
  const handleChange = (field, value) => {
    setAddress({ ...address, [field]: value });
  };

  const addressFields = ['street', 'city', 'state', 'zipCode', 'country'];

  return (
      <div className="form-group">
        <label className="block font-semibold mb-2">
          {required && <span className="text-red-500">*</span>} {label}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addressFields.map((field) => (
              <div key={field}>
                <label className="block text-sm text-gray-300 mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                    type="text"
                    placeholder={`Enter ${field}`}
                    value={address[field] || ''}
                    onChange={(e) => handleChange(field, e.target.value)}
                    required={required}
                    className="form-input"
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

  const handleChange = ({ target: { name, value } }) => {
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
      <div className="admin__edit__customer__form max-w-2xl mx-auto text-white bg-neutral-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Edit Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">First Name</label>
              <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Last Name</label>
              <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">New Password (optional)</label>
            <input
                type="password"
                name="decryptedPassword"
                value={formData.decryptedPassword}
                onChange={handleChange}
                className="form-input"
            />
          </div>

          <AddressInput
              address={formData.address}
              setAddress={handleAddressChange}
              label="Home Address"
          />

          <div>
            <label className="block text-sm mb-1">Subscriber</label>
            <Selector
                options={['TRUE', 'FALSE']}
                selectedValue={formData.isSubscriber}
                onChange={(val) => setFormData((prev) => ({ ...prev, isSubscriber: val }))}
                name="isSubscriber"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Status</label>
            <Selector
                options={['ACTIVE', 'SUSPENDED']}
                selectedValue={formData.status}
                onChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}
                name="status"
            />
          </div>

          <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition duration-200"
          >
            Update
          </button>
        </form>
      </div>
  );
};

export default EditCustomerForm;
