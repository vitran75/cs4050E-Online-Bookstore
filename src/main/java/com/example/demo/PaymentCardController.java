package com.example.demo;

import com.example.demo.model.PaymentCard;
import com.example.demo.model.Address;
import com.example.demo.service.PaymentCardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.Map;
import java.util.List;
import java.util.Optional;
// This controller handles CRUD operations for payment cards in the online bookstore application.
@RestController
@RequestMapping("/api/payment-cards")
@CrossOrigin("*")
public class PaymentCardController {

    private final PaymentCardService paymentCardService;
    // Constructor injection for PaymentCardService
    // This allows the controller to use the service methods for managing payment cards.
    // It provides endpoints to get all cards, get by ID, add new cards, update cards, delete cards, and decrypt card details.
    
    public PaymentCardController(PaymentCardService paymentCardService) {
        this.paymentCardService = paymentCardService;
    }
    // Endpoints for managing payment cards
    @GetMapping
    public ResponseEntity<List<PaymentCard>> getAllPaymentCards() {
        return ResponseEntity.ok(paymentCardService.getAllPaymentCards());
    }
    // Get a specific payment card by its ID
    @GetMapping("/{id}")
    public ResponseEntity<PaymentCard> getPaymentCardById(@PathVariable int id) {
        Optional<PaymentCard> paymentCard = paymentCardService.getPaymentCardById(id);
        return paymentCard.map(ResponseEntity::ok)
                          .orElseGet(() -> ResponseEntity.notFound().build());
    }
    // Get all payment cards associated with a specific customer
    // This endpoint retrieves all payment cards linked to a customer by their ID.
    // It returns a list of PaymentCard objects.
    // If no cards are found, it returns an empty list.
    // The customer ID is passed as a path variable.
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<PaymentCard>> getCardsByCustomer(@PathVariable int customerId) {
        List<PaymentCard> cards = paymentCardService.getCardsByCustomerId(customerId);
        return ResponseEntity.ok(cards);
    }
    // Add a new payment card using an existing customer's address
    // This endpoint allows adding a new payment card for a customer using their existing billing address.
    // The customer ID is passed as a path variable, and the payment card details are provided in the request body.
    // If the card is successfully added, it returns the saved PaymentCard object.
    @PostMapping("/customer/{customerId}")
    public ResponseEntity<?> addCardUsingCustomerAddress(
            @PathVariable int customerId,
            @RequestBody PaymentCard paymentCard) {
        try {
            PaymentCard savedCard = paymentCardService.addCardUsingCustomerAddress(customerId, paymentCard);
            return ResponseEntity.ok(savedCard);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // Add a new payment card with a new billing address for a specific customer
    // This endpoint allows adding a new payment card for a customer with a new billing address.
    // The customer ID is passed as a path variable, and the payment card details along with the new address are provided in the request body.
    // If the card is successfully added, it returns the saved PaymentCard object.
    // If there is an error, it returns a bad request response with the error message.
    @PostMapping("/customer/{customerId}/new-address")
    public ResponseEntity<?> addCardWithNewBillingAddress(
            @PathVariable int customerId,
            @RequestBody PaymentCardRequest request) {
        try {
            PaymentCard savedCard = paymentCardService.addCardWithNewAddress(customerId, request);
            return ResponseEntity.ok(savedCard);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
// Update an existing payment card by its ID
// This endpoint allows updating an existing payment card's details.
// The card ID is passed as a path variable, and the updated payment card details are provided in the request body.
// If the update is successful, it returns a success message.
// If there is an error, it returns a bad request response with the error message.
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePaymentCard(@PathVariable int id, @RequestBody PaymentCardRequest request) {
        try {
            PaymentCard updatedCard = paymentCardService.updatePaymentCard(id, request);
            return ResponseEntity.ok("Payment card updated successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
// Delete a payment card by its ID
// This endpoint allows deleting a payment card by its ID.
// The card ID is passed as a path variable.
// If the deletion is successful, it returns a success message.
// If the card is not found, it returns a 404 status with an error message.
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePaymentCard(@PathVariable int id) {
        boolean deleted = paymentCardService.deletePaymentCard(id);
        if (deleted) {
            return ResponseEntity.ok("Payment card deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("Payment card not found in the database.");
        }
    }
    // Endpoints for decrypting card details
    // These endpoints allow retrieving decrypted card number and CVV for a specific payment card by its ID.
    // The decrypted values are returned as plain text in the response body.
    // If the card is not found, it returns a 404 status with an error message.
    // Get the decrypted card number for a specific payment card by its ID
    // This endpoint retrieves the decrypted card number for a payment card identified by its ID.
    // The card ID is passed as a path variable.
    // If the card is found, it returns the decrypted card number as a plain text response.
    // If the card is not found, it returns a 404 status with an error message
    @GetMapping("/{id}/decrypt-card")
    public ResponseEntity<String> getDecryptedCardNumber(@PathVariable int id) {
        String decryptedCard = paymentCardService.getDecryptedCardNumber(id);
        return ResponseEntity.ok(decryptedCard);
    }
    // Get the decrypted CVV for a specific payment card by its ID
    // This endpoint retrieves the decrypted CVV for a payment card identified by its ID.
    // The card ID is passed as a path variable.
    // If the card is found, it returns the decrypted CVV as a plain text response.
    // If the card is not found, it returns a 404 status with an error message
    @GetMapping("/{id}/decrypt-cvv")
    public ResponseEntity<String> getDecryptedCvv(@PathVariable int id) {
        String decryptedCvv = paymentCardService.getDecryptedCvv(id);
        return ResponseEntity.ok(decryptedCvv);
    }
    // Exception handler for IllegalArgumentException       
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
    // Inner class to encapsulate the request body for adding a payment card with a new billing address
    // This class contains the payment card details and the billing address.
    // It is used in the addCardWithNewBillingAddress endpoint to receive the necessary data
    // for creating a new payment card with a new billing address.
    public static class PaymentCardRequest {
        private PaymentCard paymentCard;
        private Address billingAddress;
        // Getters and setters for paymentCard and billingAddress
        public PaymentCard getPaymentCard() {
            return paymentCard;
        }
        // This method returns the payment card details.
        // It is used to access the payment card information when adding a new card with a new
        public void setPaymentCard(PaymentCard paymentCard) {
            this.paymentCard = paymentCard;
        }
        // This method returns the billing address associated with the payment card.
        public Address getBillingAddress() {
            return billingAddress;
        }
        // This method sets the billing address for the payment card.
        // It is used to specify the address when adding a new card with a new billing address
        // It allows the user to provide a new address for the payment card.
        // This is useful when the user wants to associate a new billing address with the payment card
        // instead of using an existing one.
        public void setBillingAddress(Address billingAddress) {
            this.billingAddress = billingAddress;
        }
    }
}
