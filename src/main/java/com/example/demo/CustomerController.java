package com.example.demo;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Customer;
import com.example.demo.service.AdminService;
import com.example.demo.service.CustomerService;
import com.example.demo.service.EmailService;
import com.example.demo.util.VerificationCodeStore;
import com.example.demo.util.VerificationUtil;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin("*")  // Allow frontend calls (adjust CORS settings for production)

public class CustomerController {

    @Autowired
    private CustomerService customerService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private VerificationCodeStore verificationCodeStore;
    @Autowired
    private AdminService adminService;

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        try {
            Customer savedCustomer = customerService.registerCustomer(customer);  
            verificationCodeStore.removeCode(customer.getEmail()); 
            return ResponseEntity.ok(savedCustomer);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

     // Get a customer by email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getCustomerByEmail(@PathVariable String email) {
        try {
            Customer customer = customerService.findCustomerByEmail(email);
            return ResponseEntity.ok(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    // Get all customers
    // This endpoint retrieves all customers from the database.
    // It returns a list of Customer objects.
    // If no customers are found, it returns an empty list.
    // The endpoint is accessible via a GET request to /api/customers.
    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        try{
            List<Customer> customers = customerService.listAllCustomers();
            return ResponseEntity.ok(customers);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Handle any server errors
        }
    }
    
     // Get a customer by ID
     @GetMapping("/{id}")
     public ResponseEntity<?> getCustomersByEmail(@PathVariable int id) {
         try {
             Customer customer = customerService.findCustomerById(id);
             return ResponseEntity.ok(customer);
         } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
         }
     }

     // Update customer information
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable int id, @RequestBody Customer updatedCustomer) {
        try {
            Customer customer = customerService.updateCustomerProfile(id, updatedCustomer);
            return ResponseEntity.ok(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Delete a customer by their ID

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomerById(@PathVariable int id) {
        try {
            customerService.removeCustomerById(id);
            return ResponseEntity.ok(id);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    //Delete a customer by their email
    @DeleteMapping("/email/{email}")
    public ResponseEntity<?> deleteCustomerByEmail(@PathVariable String email) {
        try {
            Customer customer = customerService.findCustomerByEmail(email);
            customerService.removeCustomerByEmail(email);
            return ResponseEntity.ok(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    //send verification code to customer email
    @PostMapping("/send-verification")
    public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> requestbody) {
        try {
            String email = requestbody.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is required");
            }

            //if already registered, return error
            boolean isRegistered = customerService.isEmailRegistered(email) || adminService.emailExists(email);
            if (isRegistered) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email is already registered. Please log in or reset your password.");
            }

            String verificationCode = VerificationUtil.generateCode();
            verificationCodeStore.storeCode(email, verificationCode);

            try{
                emailService.sendVerificationEmail(email, verificationCode);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send verification email");

            }
            return ResponseEntity.ok("Verification code sent to " + email + "Verification code: " + verificationCode);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send verification code");
        }
    }
    
    //verify customer email
    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyCustomerEmail(@RequestBody Map<String, String> requestbody)
    {
        try {
            String email = requestbody.get("email");
            String code = requestbody.get("code");
            if (email == null || email.isEmpty() || code == null || code.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and code are required");
            }
            boolean isValid = verificationCodeStore.verifyCode(email, code);
            if (isValid) {
                verificationCodeStore.removeCode(email); // Remove code after successful verification

                try{ emailService.sendConfirmationEmail(email); // Send confirmation email
                } catch (RuntimeException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send confirmation email");
                }
                
                return ResponseEntity.ok("Email verified successfully");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid verification code");    
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to verify email");
        }  
    }

}
