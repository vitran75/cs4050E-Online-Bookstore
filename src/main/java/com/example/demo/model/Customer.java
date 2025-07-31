package com.example.demo.model;

import java.sql.Timestamp;
import java.util.List;

import com.example.demo.util.EncryptionUtil;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "email", nullable = false, length = 100, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role = Role.CUSTOMER;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status = Status.ACTIVE;

    @Column(name = "is_subscriber", nullable = false)
    private Boolean isSubscriber;

    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true,  fetch = FetchType.LAZY)
    @JsonManagedReference("customer-address")
    private Address address;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<PaymentCard> paymentCards;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    @Column(name = "updated_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private Timestamp updatedAt;

    @Column(name = "last_logged_in")
    private Timestamp lastLoggedIn;

    @Column(name = "last_logged_out")
    private Timestamp lastLoggedOut;

    @Transient
    private String decryptedPassword;

    public Customer() {}

    public Customer(String firstName, String lastName, String email, String decryptedPassword, Status status, Boolean isSubscriber, Address address) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.passwordHash = EncryptionUtil.encrypt(decryptedPassword);
        this.decryptedPassword = decryptedPassword;
        this.status = status;
        this.isSubscriber = isSubscriber;
        this.address = address;
        this.role = Role.CUSTOMER;
        Timestamp now = new Timestamp(System.currentTimeMillis());
        this.createdAt = now;
        this.updatedAt = now;
    }

    public boolean addPaymentCard(PaymentCard card) {
        if (paymentCards.size() >= 3) {
            return false;
        }
        paymentCards.add(card);
        return true;
    }

    // Getters & Setters
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getDecryptedPassword() {
        if (this.decryptedPassword == null && this.passwordHash != null) {
            this.decryptedPassword = EncryptionUtil.decrypt(this.passwordHash);
        }
        return this.decryptedPassword;
    }

    public void setDecryptedPassword(String decryptedPassword) {
        this.decryptedPassword = decryptedPassword;
    }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Boolean getIsSubscriber() { return isSubscriber; }
    public void setIsSubscriber(Boolean isSubscriber) { this.isSubscriber = isSubscriber; }

    public Address getAddress() { return address; }
    public void setAddress(Address address) {
        if (address == null) {
            if (this.address != null) {
                this.address.setCustomer(null);
            }
        } else {
            address.setCustomer(this);
        }
        this.address = address;
    }

    public List<PaymentCard> getPaymentCards() { return paymentCards; }
    public void setPaymentCards(List<PaymentCard> paymentCards) { this.paymentCards = paymentCards; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }

    public Timestamp getLastLoggedIn() { return lastLoggedIn; }
    public void setLastLoggedIn(Timestamp lastLoggedIn) { this.lastLoggedIn = lastLoggedIn; }

    public Timestamp getLastLoggedOut() { return lastLoggedOut; }
    public void setLastLoggedOut(Timestamp lastLoggedOut) { this.lastLoggedOut = lastLoggedOut; }
}
