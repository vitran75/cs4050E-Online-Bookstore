import React from 'react';

const PaymentInput = ({ paymentInfo, setPaymentInfo, label }) => {
  const handleChange = (field, value) => {
    // Basic formatting for card number and expiration date
    let formattedValue = value;
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    if (field === 'expirationDate') {
        formattedValue = value.replace(/\D/g, '');
        if (formattedValue.length > 2) {
            formattedValue = formattedValue.slice(0, 2) + ' / ' + formattedValue.slice(2, 4);
        }
    }
    if (field === 'cvc') {
        formattedValue = value.replace(/\D/g, '');
    }
    setPaymentInfo({ ...paymentInfo, [field]: formattedValue });
  };

  return (
    <div className="form-group">
      <h3 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1">{label}</h3>
      <p className="text-sm text-gray-400 mb-4">Your payment details are sent securely to our server for processing.</p>
      
      <div className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Card Number</label>
          <input
            type="text"
            placeholder="0000 0000 0000 0000"
            value={paymentInfo.cardNumber || ''}
            onChange={(e) => handleChange('cardNumber', e.target.value)}
            maxLength="19"
            className="form-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Expiration Date */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Expiration Date</label>
            <input
              type="text"
              placeholder="MM / YY"
              value={paymentInfo.expirationDate || ''}
              onChange={(e) => handleChange('expirationDate', e.target.value)}
              maxLength="7"
              className="form-input"
            />
          </div>

          {/* CVC */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">CVC</label>
            <input
              type="password" /* Use password type for CVC */
              placeholder="123"
              value={paymentInfo.cvc || ''}
              onChange={(e) => handleChange('cvc', e.target.value)}
              maxLength="4"
              className="form-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInput;