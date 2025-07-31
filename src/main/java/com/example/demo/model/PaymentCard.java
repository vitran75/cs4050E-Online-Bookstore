package com.example.demo.model; 

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.example.demo.util.EncryptionUtil;

import java.time.LocalDate;


@Entity
@Table(name = "payment_card")
public class PaymentCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cardId;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "user_id", nullable = false)
    @JsonBackReference
    private Customer customer;

    @Column(name = "last_four_digits", length = 4, nullable = false)
    private String lastFourDigits;

    @Column(name = "encrypted_card_number", length = 100, nullable = false)
    private String encryptedCardNumber;

    @Column(name = "expiration_date", nullable = false)
    private String expirationDate;

    @Column(name = "encrypted_cvv", length = 100, nullable = false)
    private String encryptedCvv;

    @ManyToOne
    @JoinColumn(name = "billing_address_id", referencedColumnName = "address_id", nullable = false)
    private Address billingAddress;

    @Transient
    private String decryptedCardNumber;

    @Transient
    private String decryptedCvv;

    public PaymentCard() {}

    @PostLoad
    private void decryptFields() {
        this.decryptedCardNumber = EncryptionUtil.decrypt(encryptedCardNumber);
        this.decryptedCvv = EncryptionUtil.decrypt(encryptedCvv);
    }

    public PaymentCard(Customer customer, String cardNumber, String expirationDate, String cvv, Address billingAddress) {
        this.customer = customer;
        this.expirationDate = expirationDate;
        this.billingAddress = billingAddress;

        this.lastFourDigits = cardNumber.substring(cardNumber.length() - 4);

        this.setDecryptedCardNumber(cardNumber);
        this.setDecryptedCvv(cvv);
    }

    public int getCardId() {
        return cardId;
    }

    public void setCardId(int cardId) {
        this.cardId = cardId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public String getLastFourDigits() {
        return lastFourDigits;
    }

    public void setLastFourDigits(String lastFourDigits) {
        this.lastFourDigits = lastFourDigits;
    }

    public String getEncryptedCardNumber() {
        return encryptedCardNumber;
    }

    public void setEncryptedCardNumber(String encryptedCardNumber) {
        this.encryptedCardNumber = encryptedCardNumber;
    }

    public String getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(String expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getEncryptedCvv() {
        return encryptedCvv;
    }

    public void setEncryptedCvv(String encryptedCvv) {
        this.encryptedCvv = encryptedCvv;
    }

    public Address getBillingAddress() {
        return billingAddress;
    }

    public void setBillingAddress(com.example.demo.model.Address newAddress) {
        this.billingAddress = newAddress;
    }

    public String getDecryptedCardNumber() {
        return decryptedCardNumber;
    }

    public void setDecryptedCardNumber(String decryptedCardNumber) {
        this.decryptedCardNumber = decryptedCardNumber;
        this.encryptedCardNumber = EncryptionUtil.encrypt(decryptedCardNumber);
    }

    public String getDecryptedCvv() {
        return decryptedCvv;
    }

    public void setDecryptedCvv(String decryptedCvv) {
        this.decryptedCvv = decryptedCvv;
        this.encryptedCvv = EncryptionUtil.encrypt(decryptedCvv);
    }
}
