package com.example.demo.service;

import com.example.demo.model.PaymentCard;
import com.example.demo.model.Customer;
import com.example.demo.model.Address;
import com.example.demo.repository.PaymentCardRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.AddressRepository;
import com.example.demo.util.EncryptionUtil;
import com.example.demo.PaymentCardController.PaymentCardRequest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentCardService {

    private final PaymentCardRepository paymentCardRepository;
    private final CustomerRepository customerRepository;
    private final AddressRepository addressRepository;

    public PaymentCardService(PaymentCardRepository paymentCardRepository, 
                              CustomerRepository customerRepository,
                              AddressRepository addressRepository) {
        this.paymentCardRepository = paymentCardRepository;
        this.customerRepository = customerRepository;
        this.addressRepository = addressRepository;
    }

    public List<PaymentCard> getAllPaymentCards() {
        return paymentCardRepository.findAll();
    }

    public Optional<PaymentCard> getPaymentCardById(int id) {
        return paymentCardRepository.findById(id);
    }

    public List<PaymentCard> getCardsByCustomerId(int customerId) {
        return paymentCardRepository.findByCustomerUserId(customerId);
    }

    public PaymentCard addCardUsingCustomerAddress(int customerId, PaymentCard paymentCard) {
        validateCardDetails(paymentCard);

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        if (customer.getAddress() == null) {
            throw new IllegalArgumentException("Customer does not have a registered address.");
        }

        paymentCard.setCustomer(customer);
        paymentCard.setBillingAddress(customer.getAddress());
        return encryptAndSavePaymentCard(paymentCard);
    }

    public PaymentCard addCardWithNewAddress(int customerId, PaymentCardRequest request) {
        validateCardDetails(request.getPaymentCard());

        String encryptedCardNumber = EncryptionUtil.encrypt(request.getPaymentCard().getDecryptedCardNumber());

        Optional<PaymentCard> existingCard = paymentCardRepository.findByEncryptedCardNumber(encryptedCardNumber);
        if (existingCard.isPresent()) {
            throw new IllegalArgumentException("This payment card already exists in the system.");
        }

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        Address newAddress = request.getBillingAddress();
        Optional<Address> existingAddress = addressRepository.findByStreetLineAndCityNameAndStateCodeAndPostalCodeAndCountryName(
                newAddress.getStreetLine(),
                newAddress.getCityName(),
                newAddress.getStateCode(),
                newAddress.getPostalCode(),
                newAddress.getCountryName()
        );

        if (existingAddress.isPresent()) {
            newAddress = existingAddress.get();
        } else {
            newAddress = addressRepository.save(newAddress);
        }

        PaymentCard paymentCard = request.getPaymentCard();
        paymentCard.setCustomer(customer);
        paymentCard.setBillingAddress(newAddress);
        return encryptAndSavePaymentCard(paymentCard);
    }

    public PaymentCard updatePaymentCard(int id, PaymentCardRequest request) {
        PaymentCard card = paymentCardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment card not found"));

        PaymentCard updatedInfo = request.getPaymentCard();

        if (updatedInfo != null) {
            if (updatedInfo.getDecryptedCardNumber() != null) {
                card.setDecryptedCardNumber(updatedInfo.getDecryptedCardNumber());
            }

            if (updatedInfo.getDecryptedCvv() != null) {
                card.setDecryptedCvv(updatedInfo.getDecryptedCvv());
            }

            if (updatedInfo.getExpirationDate() != null) {
                card.setExpirationDate(updatedInfo.getExpirationDate());
            }
        }

        Address newBilling = request.getBillingAddress();
        if (newBilling != null) {
            Optional<Address> existingAddress = addressRepository.findByStreetLineAndCityNameAndStateCodeAndPostalCodeAndCountryName(
                    newBilling.getStreetLine(),
                    newBilling.getCityName(),
                    newBilling.getStateCode(),
                    newBilling.getPostalCode(),
                    newBilling.getCountryName()
            );

            if (existingAddress.isPresent()) {
                card.setBillingAddress(existingAddress.get());
            } else {
                card.setBillingAddress(addressRepository.save(newBilling));
            }
        }

        return paymentCardRepository.save(card);
    }

    private PaymentCard encryptAndSavePaymentCard(PaymentCard paymentCard) {
        String encryptedCardNumber = EncryptionUtil.encrypt(paymentCard.getDecryptedCardNumber());
        String encryptedCvv = EncryptionUtil.encrypt(paymentCard.getDecryptedCvv());

        Optional<PaymentCard> existingCard = paymentCardRepository.findByEncryptedCardNumber(encryptedCardNumber);
        if (existingCard.isPresent()) {
            throw new IllegalArgumentException("This payment card already exists in the system.");
        }

        long cardCount = paymentCardRepository.countByCustomer(paymentCard.getCustomer());
        if (cardCount >= 3) {
            throw new IllegalArgumentException("A customer can have at most 3 payment cards.");
        }

        paymentCard.setLastFourDigits(paymentCard.getDecryptedCardNumber().substring(paymentCard.getDecryptedCardNumber().length() - 4));
        paymentCard.setEncryptedCardNumber(encryptedCardNumber);
        paymentCard.setEncryptedCvv(encryptedCvv);

        return paymentCardRepository.save(paymentCard);
    }

    @Transactional
    public boolean deletePaymentCard(int id) {
        Optional<PaymentCard> existingCard = paymentCardRepository.findById(id);

        if (existingCard.isPresent()) {
            PaymentCard card = existingCard.get();

            Customer customer = card.getCustomer();
            if (customer != null) {
                customer.getPaymentCards().remove(card);
                customerRepository.save(customer);
            }

            paymentCardRepository.delete(card);
            return true;
        } else {
            return false;
        }
    }

    public String getDecryptedCardNumber(int paymentCardId) {
        return paymentCardRepository.findById(paymentCardId)
                .map(PaymentCard::getDecryptedCardNumber)
                .orElseThrow(() -> new IllegalArgumentException("Payment card not found"));
    }

    public String getDecryptedCvv(int paymentCardId) {
        return paymentCardRepository.findById(paymentCardId)
                .map(PaymentCard::getDecryptedCvv)
                .orElseThrow(() -> new IllegalArgumentException("Payment card not found"));
    }

    private void validateCardDetails(PaymentCard paymentCard) {
        String cardNumber = paymentCard.getDecryptedCardNumber();
        String cvv = paymentCard.getDecryptedCvv();

        if (cardNumber == null || !cardNumber.matches("\\d{4,19}")) {
            throw new IllegalArgumentException("Invalid card number");
        }
        if (cvv == null || !cvv.matches("\\d{3,4}")) {
            throw new IllegalArgumentException("Invalid CVV");
        }
    }
}
