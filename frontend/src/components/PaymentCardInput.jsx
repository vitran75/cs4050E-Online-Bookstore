import React, { useEffect, useState } from "react";

const PaymentCardInput = ({ paymentCards, setPaymentCards, existingPaymentCards, handleDelete }) => {
  const [newCardData, setNewCardData] = useState({
    paymentCard: {
      decryptedCardNumber: "",
      expirationDate: "",
      decryptedCvv: "",
    },
    billingAddress: {
      streetLine: "",
      cityName: "",
      stateCode: "",
      postalCode: "",
      countryName: "",
    },
  });

  const [formVisible, setFormVisible] = useState(false);
  const [error, setError] = useState("");

  const totalCardCount = paymentCards.length + (existingPaymentCards?.length || 0);

  useEffect(() => {
    if (totalCardCount > 3) {
      setPaymentCards(paymentCards.slice(0, 3 - (existingPaymentCards?.length || 0)));
    }
  }, [paymentCards, existingPaymentCards, setPaymentCards]);

  const updateCardField = (section, field, value) => {
    setNewCardData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const resetNewCardForm = () => {
    setNewCardData({
      paymentCard: { decryptedCardNumber: "", expirationDate: "", decryptedCvv: "" },
      billingAddress: { streetLine: "", cityName: "", stateCode: "", postalCode: "", countryName: "" },
    });
    setFormVisible(false);
    setError("");
  };

  const saveNewCard = () => {
    const { paymentCard, billingAddress } = newCardData;
    const fields = Object.values(paymentCard).concat(Object.values(billingAddress));

    if (fields.some((val) => !val.trim())) {
      setError("Please fill out all fields.");
      return;
    }

    if (totalCardCount >= 3) {
      setError("Card limit reached. Maximum 3 cards allowed.");
      return;
    }

    setPaymentCards([...paymentCards, newCardData]);
    resetNewCardForm();
  };

  const removeCard = (index) => {
    const updated = [...paymentCards];
    updated.splice(index, 1);
    setPaymentCards(updated);
  };

  // A helper to format field names for placeholders
  const formatPlaceholder = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }

  return (
    <div>
        <h3 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-1">Payment Methods</h3>
      
      {/* Display existing cards fetched from the DB */}
      {existingPaymentCards?.length > 0 && (
        <div className="mb-4">
          {existingPaymentCards.map((card, idx) => (
            <div key={card.cardId || idx} className="p-3 mb-2 bg-gray-700 rounded-md">
              <p><strong>Card:</strong> **** **** **** {card.lastFourDigits}</p>
              <p className="text-sm"><strong>Expires:</strong> {card.expirationDate}</p>
              <button type="button" onClick={() => handleDelete(card.cardId)} className="text-red-500 hover:text-red-400 text-sm mt-1">Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* Display newly added cards that are not yet saved to the DB */}
      {paymentCards.map((card, index) => (
        <div key={index} className="p-3 mb-2 bg-blue-900/50 rounded-md">
          <p><strong>New Card:</strong> {card.paymentCard.decryptedCardNumber}</p>
          <button type="button" onClick={() => removeCard(index)} className="text-red-500 hover:text-red-400 text-sm mt-1">Remove</button>
        </div>
      ))}

      {formVisible && (
        <div className="p-4 bg-gray-900 rounded-md mt-4 space-y-3">
          <h4 className="font-semibold">Add New Card</h4>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(newCardData.billingAddress).map(([key, val]) => (
                <input
                  key={key} type="text" placeholder={formatPlaceholder(key)} value={val}
                  onChange={(e) => updateCardField("billingAddress", key, e.target.value)}
                  className="form-input"
                />
              ))}
          </div>

          <input
            type="text" placeholder="Card Number" value={newCardData.paymentCard.decryptedCardNumber}
            maxLength={19} onChange={(e) => updateCardField("paymentCard", "decryptedCardNumber", e.target.value)}
            className="form-input"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text" placeholder="CVV" value={newCardData.paymentCard.decryptedCvv}
              maxLength={4} onChange={(e) => updateCardField("paymentCard", "decryptedCvv", e.target.value)}
              className="form-input"
            />
            <input
              type="date" value={newCardData.paymentCard.expirationDate}
              onChange={(e) => updateCardField("paymentCard", "expirationDate", e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <button type="button" onClick={saveNewCard} className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md mr-2">Save Card to Add</button>
            <button type="button" onClick={resetNewCardForm} className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded-md">Cancel</button>
          </div>
        </div>
      )}

      {!formVisible && totalCardCount < 3 && (
        <button type="button" onClick={() => setFormVisible(true)} className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md mt-2">
          Add New Card
        </button>
      )}
    </div>
  );
};


export default PaymentCardInput;
