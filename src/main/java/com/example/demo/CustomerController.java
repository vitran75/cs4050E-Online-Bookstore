package com.example.demo;

import com.example.demo.model.Customer;
import com.example.demo.model.Admin;
import com.example.demo.model.Status;
import com.example.demo.service.AdminService;
import com.example.demo.service.CustomerService;
import com.example.demo.service.EmailService;
import com.example.demo.util.VerificationCodeStore;
import com.example.demo.util.VerificationUtil;
import com.example.demo.util.EncryptionUtil;
import com.example.demo.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin("*")
public class CustomerController {

    @Autowired private CustomerService customerService;
    @Autowired private EmailService emailService;
    @Autowired private VerificationCodeStore verificationCodeStore;
    @Autowired private AdminService adminService;
    @Autowired private JwtUtil jwtUtil;
    // Endpoint to create a new customer
    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody Customer customer) {
        try {
            if (customerService.isEmailRegistered(customer.getEmail()) || adminService.emailExists(customer.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
            }
            Customer savedCustomer = customerService.registerCustomer(customer);
            verificationCodeStore.removeCode(customer.getEmail());
            return ResponseEntity.ok(savedCustomer);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error during registration");
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getCustomerByEmail(@PathVariable String email) {
        try {
            Customer customer = customerService.findCustomerByEmail(email);
            return ResponseEntity.ok(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
        }
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        try {
            List<Customer> customers = customerService.listAllCustomers();
            return ResponseEntity.ok(customers);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable int id) {
        try {
            Customer customer = customerService.findCustomerById(id);
            return ResponseEntity.ok(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable int id, @RequestBody Customer updatedCustomer) {
        try {
            Customer customer = customerService.updateCustomerProfile(id, updatedCustomer);
            return ResponseEntity.ok(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Update failed");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomerById(@PathVariable int id) {
        try {
            customerService.removeCustomerById(id);
            return ResponseEntity.ok("Customer deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
        }
    }

    @DeleteMapping("/email/{email}")
    public ResponseEntity<?> deleteCustomerByEmail(@PathVariable String email) {
        try {
            customerService.findCustomerByEmail(email);
            customerService.removeCustomerByEmail(email);
            return ResponseEntity.ok("Customer deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
        }
    }

    @PostMapping("/send-verification")
    public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (customerService.isEmailRegistered(email) || adminService.emailExists(email)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
            }
            String code = VerificationUtil.generateCode();
            verificationCodeStore.storeCode(email, code);
            try {
                emailService.sendVerificationEmail(email, code);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email");
            }
            return ResponseEntity.ok("Verification code sent to " + email + ". Code: " + code);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Verification failed");
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyCustomerEmail(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String code = body.get("code");
            if (email == null || email.isEmpty() || code == null || code.isEmpty()) {
                return ResponseEntity.badRequest().body("Email and code are required");
            }
            if (!verificationCodeStore.verifyCode(email, code)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid code");
            }
            verificationCodeStore.removeCode(email);
            try {
                emailService.sendConfirmationEmail(email);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send confirmation email");
            }
            return ResponseEntity.ok("Email verified successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Verification failed");
        }
    }
    // Endpoint for customer login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email and password must be provided.");
        }

        try {
            Customer customer = customerService.findCustomerByEmail(email);
            if (customer.getStatus() == Status.SUSPENDED) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Account suspended.");
            }
            if (EncryptionUtil.verifyPassword(password, customer.getPasswordHash())) {
                if (customer.getStatus() == Status.INACTIVE) {
                    customer.setStatus(Status.ACTIVE);
                }
                customer.setLastLoggedIn(new Timestamp(System.currentTimeMillis()));
                customerService.save(customer);

                String token = jwtUtil.generateToken(email, customer.getRole().toString()); // Generate JWT token
                return ResponseEntity.ok(Map.of(
                    "message", "Login successful.",
                    "role", customer.getRole().toString(),
                    "token", token
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password.");
            }
        } catch (RuntimeException ce) {
            try {
                Admin admin = adminService.getAdminByEmail(email);
                if (EncryptionUtil.verifyPassword(password, admin.getPasswordHash())) {
                    admin.setLastLoggedIn(new Timestamp(System.currentTimeMillis()));
                    adminService.saveAdmin(admin);

                    String token = jwtUtil.generateToken(email, admin.getRole().toString());
                    return ResponseEntity.ok(Map.of(
                        "message", "Login successful.",
                        "role", admin.getRole().toString(),
                        "token", token
                    ));
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password.");
                }
            } catch (RuntimeException ae) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found.");
            }
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required.");
        }
        try {
            Customer customer = customerService.findCustomerByEmail(email);
            customer.setLastLoggedOut(new Timestamp(System.currentTimeMillis()));
            customerService.save(customer);
            return ResponseEntity.ok("Logout successful.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found.");
        }
    }
}
