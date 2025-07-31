import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Selector from './Selector';
import Swal from 'sweetalert2';

const AddressInput = ({ address, setAddress, label, required = true }) => {
  const handleChange = (field, value) => {
    setAddress({ ...address, [field]: value });
  };
  const addressFields = ['streetLine', 'cityName', 'stateCode', 'postalCode', 'countryName'];
  const fieldLabels = {
    streetLine: 'Street',
    cityName: 'City',
    stateCode: 'State',
    postalCode: 'Zip Code',
    countryName: 'Country',
  };
  return (
      <div className="form-group">
        <h3 className="text-lg font-semibold mb-2">{label}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addressFields.map((field) => (
              <div key={field}>
                <label className="block text-sm text-gray-300 mb-1">{fieldLabels[field]}</label>
                <input
                    type="text"
                    placeholder={`Enter ${fieldLabels[field]}`}
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
      streetLine: '', cityName: '', stateCode: '', postalCode: '', countryName: '',
    },
    isSubscriber: customer.isSubscriber ? 'TRUE' : 'FALSE',
    status: customer.status,
    role: customer.role,
  });

  const [paymentCard, setPaymentCard] = useState({
    cardId: null,
    lastFourDigits: '',
    decryptedCardNumber: '',
    expirationDate: '',
    decryptedCvv: '',
  });

  useEffect(() => {
    const fetchCard = async () => {
      if (!customer.userId) return;
      try {
        const response = await axios.get(`http://localhost:8080/api/payment-cards/customer/${customer.userId}`);
        if (response.data && response.data.length > 0) {
          const existingCard = response.data[0];
          setPaymentCard({
            cardId: existingCard.cardId,
            lastFourDigits: existingCard.lastFourDigits,
            decryptedCardNumber: '',
            expirationDate: '',
            decryptedCvv: '',
          });
        }
      } catch (error) {
        console.error("Failed to fetch payment card:", error);
      }
    };
    fetchCard();
  }, [customer.userId]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (newAddress) => {
    setFormData((prev) => ({ ...prev, address: newAddress }));
  };

  const handlePaymentCardChange = ({ target: { name, value } }) => {
    setPaymentCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/customers/${formData.userId}`, formData);

      if (paymentCard.decryptedCardNumber) {
        const cardPayload = {
          paymentCard: {
            decryptedCardNumber: paymentCard.decryptedCardNumber,
            expirationDate: paymentCard.expirationDate,
            decryptedCvv: paymentCard.decryptedCvv,
          },
          billingAddress: formData.address,
        };

        if (paymentCard.cardId) {
          await axios.put(`http://localhost:8080/api/payment-cards/${paymentCard.cardId}`, cardPayload);
        } else {
          await axios.post(`http://localhost:8080/api/payment-cards/customer/${formData.userId}/new-address`, cardPayload);
        }
      }

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated Successfully',
        confirmButtonColor: '#e50914',
      });
      setTimeout(() => window.location.reload(), 2000);

    } catch (error) {
      console.error("Update failed:", error.response ? error.response.data : error.message);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.error || 'An unexpected error occurred.',
        confirmButtonColor: '#e50914',
      });
    }
  };

  return (
      <div className="admin__edit__customer__form max-w-2xl mx-auto text-white bg-neutral-800 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Section: Basic Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1">Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
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
                <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
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
          </div>

          {/* Section: Account Email */}
          <div>
            <h3 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1">Account</h3>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="form-input bg-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Section: Password */}
          <div>
            <h3 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1">Security</h3>
            <label className="block text-sm font-medium text-gray-300 mb-1">New Password (optional)</label>
            <input
                type="password"
                name="decryptedPassword"
                value={formData.decryptedPassword}
                onChange={handleChange}
                className="form-input"
            />
          </div>

          {/* Address */}
          <AddressInput
              address={formData.address}
              setAddress={handleAddressChange}
              label="Billing Address"
          />

          {/* Payment Method */}
          <div>
            <h3 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1">Payment Method</h3>
            {paymentCard.cardId && (
              <div className="p-3 mb-2 bg-gray-700 rounded-md">
                <p><strong>Current Card on File:</strong> **** **** **** {paymentCard.lastFourDigits}</p>
                <p className="text-sm text-gray-400">To update, enter new card details below.</p>
              </div>
            )}
            <div className="space-y-3 mt-4">
               <input
                type="text"
                name="decryptedCardNumber"
                placeholder="Enter New Card Number"
                value={paymentCard.decryptedCardNumber}
                onChange={handlePaymentCardChange}
                className="form-input"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    name="expirationDate"
                    placeholder="MM/YY"
                    value={paymentCard.expirationDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Allow only digits and slash
                      if (/^[0-9/]*$/.test(val) && val.length <= 5) {
                        // Auto-format MM/YY
                        if (val.length === 2 && !val.includes('/')) {
                          setPaymentCard((prev) => ({ ...prev, expirationDate: `${val}/` }));
                        } else {
                          setPaymentCard((prev) => ({ ...prev, expirationDate: val }));
                        }
                      }
                    }}
                    className="form-input"
                />

                <input
                  type="password"
                  name="decryptedCvv"
                  placeholder="CVV"
                  maxLength="4"
                  value={paymentCard.decryptedCvv}
                  onChange={handlePaymentCardChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>
          
          {/* Preferences Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1">Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Receive Promotions?</label>
                <Selector options={['TRUE', 'FALSE']} selectedValue={formData.isSubscriber} onChange={(val) => setFormData((prev) => ({ ...prev, isSubscriber: val }))}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Account Status</label>
                <Selector options={['ACTIVE', 'SUSPENDED']} selectedValue={formData.status} onChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}/>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition duration-200">
              Save Changes
            </button>
          </div>
        </form>
      </div>
  );
};

export default EditCustomerForm;
