package com.example.demo.service;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.PaymentCardController.PaymentCardRequest;
import com.example.demo.model.Address;
import com.example.demo.model.Customer;
import com.example.demo.model.PaymentCard;
import com.example.demo.model.Role;
import com.example.demo.model.Status;
import com.example.demo.repository.AddressRepository;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.PaymentCardRepository;
import com.example.demo.util.EncryptionUtil;


@Service
public class CustomerService {

    @Autowired private CustomerRepository customerRepository;
    @Autowired private AddressRepository addressRepository;
    @Autowired private AdminRepository adminRepository;
    @Autowired private PaymentCardRepository paymentCardRepository;
    @Autowired private PaymentCardService paymentCardService;
    @Autowired private EmailService emailService;

    /**
     * Registers a new customer.
     */
    @Transactional
    public Customer registerCustomer(Customer customer) {
        if (customer.getFirstName() == null || customer.getFirstName().isBlank() ||
            customer.getLastName() == null || customer.getLastName().isBlank() ||
            customer.getEmail() == null || customer.getEmail().isBlank() ||
            customer.getDecryptedPassword() == null || customer.getDecryptedPassword().isBlank()) {
            throw new IllegalArgumentException("Missing required customer fields.");
        }

        if (customerRepository.findByEmail(customer.getEmail()).isPresent() ||
            adminRepository.findByEmail(customer.getEmail()).isPresent()) {
            throw new RuntimeException("Email already associated with an existing user.");
        }

        customer.setRole(Role.CUSTOMER);
        customer.setStatus(customer.getStatus() != null ? customer.getStatus() : Status.ACTIVE);
        customer.setPasswordHash(EncryptionUtil.encrypt(customer.getDecryptedPassword()));
        customer.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        customer.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        // Address deduplication
        if (customer.getAddress() != null) {
            Address addr = customer.getAddress();
            addressRepository.findByStreetLineAndCityNameAndStateCodeAndPostalCodeAndCountryName(
                addr.getStreetLine(), addr.getCityName(), addr.getStateCode(),
                addr.getPostalCode(), addr.getCountryName()
            ).ifPresentOrElse(
                customer::setAddress,
                () -> customer.setAddress(addressRepository.save(addr))
            );
        }

        Customer savedCustomer = customerRepository.save(customer);

        // Optionally process initial payment cards
        if (customer.getPaymentCards() != null && !customer.getPaymentCards().isEmpty()) {
            for (PaymentCard card : customer.getPaymentCards()) {
                PaymentCardRequest req = new PaymentCardRequest();
                req.setPaymentCard(card);
                req.setBillingAddress(card.getBillingAddress());
                paymentCardService.addCardWithNewAddress(savedCustomer.getUserId(), req);
            }
        }

        savedCustomer.setDecryptedPassword(customer.getDecryptedPassword());
        return savedCustomer;
    }

    @Transactional(readOnly = true)
    public List<Customer> listAllCustomers() {
        List<Customer> list = customerRepository.findAll();
        list.forEach(c -> c.getPaymentCards().size()); // Eager-load
        return list;
    }

    public Customer findCustomerByEmail(String email) {
        return customerRepository.findByEmail(email)
            .map(c -> { c.setDecryptedPassword(c.getDecryptedPassword()); return c; })
            .orElseThrow(() -> new RuntimeException("Customer not found by email: " + email));
    }

    public Customer findCustomerById(int id) {
        return customerRepository.findById(id)
            .map(c -> { c.setDecryptedPassword(c.getDecryptedPassword()); return c; })
            .orElseThrow(() -> new RuntimeException("Customer not found by ID: " + id));
    }

    public boolean isEmailRegistered(String email) {
        return customerRepository.findByEmail(email).isPresent();
    }

    public Customer updateCustomerProfile(int id, Customer updateData) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (updateData.getFirstName() != null && !updateData.getFirstName().isBlank()) {
            customer.setFirstName(updateData.getFirstName());
        }
        if (updateData.getLastName() != null && !updateData.getLastName().isBlank()) {
            customer.setLastName(updateData.getLastName());
        }
        if (updateData.getStatus() != null) {
            customer.setStatus(updateData.getStatus());
        }
        if (updateData.getIsSubscriber() != null) {
            customer.setIsSubscriber(updateData.getIsSubscriber());
        }

        if (updateData.getDecryptedPassword() != null && !updateData.getDecryptedPassword().isBlank()) {
            customer.setPasswordHash(EncryptionUtil.encrypt(updateData.getDecryptedPassword()));
            customer.setDecryptedPassword(updateData.getDecryptedPassword());
        } else {
            customer.setDecryptedPassword(EncryptionUtil.decrypt(customer.getPasswordHash()));
        }

        if (updateData.getAddress() != null) {
            Address incomingAddress = updateData.getAddress();
            
            if (customer.getAddress() == null) {
                // If there's no existing address, set the new one.
                // The custom setAddress method will handle linking both sides.
                customer.setAddress(incomingAddress);
            } else {
                // If an address already exists, just update its fields.
                // DO NOT create a new Address object.
                Address existingAddress = customer.getAddress();
                existingAddress.setStreetLine(incomingAddress.getStreetLine());
                existingAddress.setCityName(incomingAddress.getCityName());
                existingAddress.setStateCode(incomingAddress.getStateCode());
                existingAddress.setPostalCode(incomingAddress.getPostalCode());
                existingAddress.setCountryName(incomingAddress.getCountryName());
            }
        }

        customer.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        Customer saved = customerRepository.save(customer);

        try {
            emailService.sendProfileUpdateConfirmation(customer.getEmail());
        } catch (Exception e) {
            throw new RuntimeException("Profile updated, but failed to send confirmation email.");
        }

        return saved;
    }

    public void removeCustomerById(int id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer with ID " + id + " does not exist.");
        }
        customerRepository.deleteById(id);
    }

    public void removeCustomerByEmail(String email) {
        Customer customer = customerRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Customer with given email not found"));
        customerRepository.delete(customer);
    }

    public void save(Customer customer) {
        customerRepository.save(customer);
    }

    public void updatePassword(String email, String currentPassword, String newPassword) {
        Customer customer = customerRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (!EncryptionUtil.verifyPassword(currentPassword, customer.getPasswordHash())) {
            throw new RuntimeException("Incorrect current password.");
        }

        customer.setPasswordHash(EncryptionUtil.encrypt(newPassword));
        customerRepository.save(customer);

        try {
            emailService.sendPasswordResetConfirmation(email);
        } catch (Exception e) {
            throw new RuntimeException("Password changed, but failed to send confirmation email.");
        }
    }
}
