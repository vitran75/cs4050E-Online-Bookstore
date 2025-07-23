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
      city: "",
      state: "",
      PostalCode: "",
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
      paymentCard: {
        decryptedCardNumber: "",
        expirationDate: "",
        decryptedCvv: "",
      },
      billingAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
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

  return (
    <div>
      {paymentCards.length === 0 && !formVisible && <p>No cards added. You may add one below.</p>}

      {existingPaymentCards?.length > 0 && (
        <div className="existing-payment-cards">
          <label>Saved Cards:</label>
          {existingPaymentCards.map((card, idx) => (
            <div key={card.cardId || idx} className="payment-card-item">
              <p><strong>Card:</strong> **** **** **** {card.lastFourDigits}</p>
              <p><strong>Expires:</strong> {card.expirationDate}</p>
              <button type="button" onClick={() => handleDelete(card.cardId)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {paymentCards.map((card, index) => (
        <div key={index} className="admin__form__review__att">
          <h3>Card {index + 1}</h3>
          <div>
            <p><strong>Number:</strong> {card.paymentCard.decryptedCardNumber}</p>
            <p><strong>CVV:</strong> {card.paymentCard.decryptedCvv}</p>
            <p><strong>Exp:</strong> {card.paymentCard.expirationDate}</p>
          </div>
          <div>
            <p><strong>Address:</strong></p>
            <p>{card.billingAddress.street}, {card.billingAddress.city}, {card.billingAddress.state}, {card.billingAddress.zipCode}, {card.billingAddress.country}</p>
          </div>
          <button onClick={() => removeCard(index)}>Remove</button>
        </div>
      ))}

      {formVisible && (
        <div className="admin__form__review__att">
          <h3>Add New Card</h3>
          {error && <p style={{ color: "red" }}>{error}</p>}

          {Object.entries(newCardData.billingAddress).map(([key, val]) => (
            <input
              key={key}
              type="text"
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={val}
              onChange={(e) => updateCardField("billingAddress", key, e.target.value)}
            />
          ))}

          <input
            type="text"
            placeholder="Card Number"
            value={newCardData.paymentCard.decryptedCardNumber}
            maxLength={16}
            onChange={(e) => updateCardField("paymentCard", "decryptedCardNumber", e.target.value)}
          />
          <input
            type="text"
            placeholder="CVV"
            value={newCardData.paymentCard.decryptedCvv}
            maxLength={3}
            onChange={(e) => updateCardField("paymentCard", "decryptedCvv", e.target.value)}
          />
          <input
            type="date"
            value={newCardData.paymentCard.expirationDate}
            onChange={(e) => updateCardField("paymentCard", "expirationDate", e.target.value)}
          />

          <button onClick={saveNewCard}>Save Card</button>
          <button onClick={resetNewCardForm}>Cancel</button>
        </div>
      )}

      {!formVisible && (
        <button onClick={() => setFormVisible(true)}>Add New Card</button>
      )}
    </div>
  );
};

export default PaymentCardInput;
