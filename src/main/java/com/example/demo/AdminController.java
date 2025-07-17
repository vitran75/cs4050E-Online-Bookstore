package com.example.demo;

import com.example.demo.model.Admin;
import com.example.demo.service.AdminService;
import com.example.demo.service.CustomerService;
import com.example.demo.service.EmailService;
import com.example.demo.util.EncryptionUtil;
import com.example.demo.util.VerificationCodeStore;
import com.example.demo.util.VerificationUtil;
import com.example.demo.util.PasswordResetCodeStore;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.sql.Timestamp;
import java.util.Map;
import java.util.List;
// addmin management controller
@RestController
@RequestMapping("/api/admins")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private VerificationCodeStore verificationCodeStore;

    /**
     * Admin registration endpoint.
     * @param admin The admin details to register.
     * @return ResponseEntity with success message or error details.
     */
    @PostMapping
    public ResponseEntity<?> registerAdmin(@RequestBody Admin admin) {
        try {
            Admin newAdmin = adminService.createAdmin(admin);
            return ResponseEntity.ok(Map.of("message", "Admin registered successfully", "admin", newAdmin));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
    /**
     * List all registered admins.
     * @return ResponseEntity with list of admins.
     */
    @GetMapping
    public ResponseEntity<List<Admin>> listAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    /**
     * Find an admin by ID.
     * @param id The ID of the admin to find.
     * @return ResponseEntity with admin details or error message.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> findAdminById(@PathVariable int id) {
        try {
            return ResponseEntity.ok(adminService.getAdminById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Find an admin by email.
     * @param email The email of the admin to find.
     * @return ResponseEntity with admin details or error message.
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<?> findAdminByEmail(@PathVariable String email) {
        try {
            return ResponseEntity.ok(adminService.getAdminByEmail(email));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Update an existing admin's details.
     * @param id The ID of the admin to update.
     * @param updatedAdmin The updated admin details.
     * @return ResponseEntity with success message or error details.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> modifyAdmin(@PathVariable int id, @RequestBody Admin updatedAdmin) {
        try {
            return ResponseEntity.ok(adminService.updateAdmin(id, updatedAdmin));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Remove an admin by ID.
     * @param id The ID of the admin to remove.
     * @return ResponseEntity with success message or error details.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeAdminById(@PathVariable int id) {
        try {
            adminService.deleteAdminById(id);
            return ResponseEntity.ok(Map.of("message", "Admin with ID " + id + " removed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Remove an admin by email.
     * @param email The email of the admin to remove.
     * @return ResponseEntity with success message or error details.
     */
    @DeleteMapping("/email/{email}")
    public ResponseEntity<?> removeAdminByEmail(@PathVariable String email) {
        try {
            adminService.deleteAdminByEmail(email);
            return ResponseEntity.ok(Map.of("message", "Admin with email " + email + " removed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Send a verification code to the admin's email for registration.
     * @param payload The payload containing the email address.
     * @return ResponseEntity with success message or error details.
     */
    @PostMapping("/send-verification")
    public ResponseEntity<?> sendVerification(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        if (customerService.isEmailRegistered(email) || adminService.emailExists(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email already in use. Please log in or reset your password."));
        }

        String code = VerificationUtil.generateCode();
        verificationCodeStore.storeCode(email, code);

        try {
            emailService.sendVerificationEmail(email, code);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", "Unable to send email. Check email validity."));
        }

        return ResponseEntity.ok(Map.of("message", "Verification code sent", "code", code));
    }
    
    /**
     * Verify the code sent to the admin's email.
     * @param payload The payload containing the email and verification code.
     * @return ResponseEntity with success message or error details.
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String code = payload.get("code");

        if (email == null || code == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Email and code are required"));
        }

        if (verificationCodeStore.verifyCode(email, code)) {
            verificationCodeStore.removeCode(email);
            try {
                emailService.sendConfirmationEmail(email);
            } catch (RuntimeException e) {
                return ResponseEntity.status(400).body(Map.of("error", "Confirmation email failed to send."));
            }
            return ResponseEntity.ok(Map.of("message", "Verification successful. You may now register."));
        } else {
            return ResponseEntity.status(400).body(Map.of("error", "Invalid verification code."));
        }
    }

    /**
     * Admin login endpoint.
     * @param payload The payload containing email and password.
     * @return ResponseEntity with success message or error details.
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        if (email == null || password == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Email and password are required"));
        }

        try {
            Admin admin = adminService.getAdminByEmail(email);
            if (EncryptionUtil.verifyPassword(password, admin.getPasswordHash())) {
                admin.setLastLoggedIn(new Timestamp(System.currentTimeMillis()));
                adminService.saveAdmin(admin);
                return ResponseEntity.ok(Map.of("message", "Login successful"));
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Email not found"));
        }
    }

    /**
     * Admin logout endpoint.
     * @param payload The payload containing the email of the admin.
     * @return ResponseEntity with success message or error details.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logoutAdmin(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");

        if (email == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Email is required"));
        }

        try {
            Admin admin = adminService.getAdminByEmail(email);
            admin.setLastLoggedOut(new Timestamp(System.currentTimeMillis()));
            adminService.saveAdmin(admin);
            return ResponseEntity.ok(Map.of("message", "Logout successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Email not found"));
        }
    }

    /**
     * Initiate password reset process for an admin.
     * @param payload The payload containing the email address.
     * @return ResponseEntity with success message or error details.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> initiatePasswordReset(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        if (!adminService.emailExists(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "No admin account with this email"));
        }

        try {
            String resetCode = VerificationUtil.generateCode();
            PasswordResetCodeStore.storeResetCode(email, resetCode);
            emailService.sendPasswordResetCode(email, resetCode);
            return ResponseEntity.ok(Map.of("message", "Reset code sent", "code", resetCode));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", "Failed to send reset code email"));
        }
    }

    /**
     * Complete the password reset process for an admin.
     * @param payload The payload containing email, reset code, and new password.
     * @return ResponseEntity with success message or error details.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> completePasswordReset(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String code = payload.get("code");
        String newPassword = payload.get("newPassword");

        if (email == null || code == null || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email, code, and new password are required"));
        }

        if (!PasswordResetCodeStore.isValidResetCode(email, code)) {
            return ResponseEntity.status(400).body(Map.of("error", "Invalid or expired code"));
        }

        try {
            Admin admin = adminService.getAdminByEmail(email);
            admin.setPasswordHash(EncryptionUtil.encrypt(newPassword));
            adminService.saveAdmin(admin);
            PasswordResetCodeStore.clearResetCode(email);
            emailService.sendPasswordResetConfirmation(email);
            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Password reset failed"));
        }
    }

    /**
     * Change the password of an admin.
     * @param payload The payload containing email, old password, and new password.
     * @return ResponseEntity with success message or error details.
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String oldPassword = payload.get("oldPassword");
        String newPassword = payload.get("newPassword");

        if (email == null || oldPassword == null || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "All password fields are required"));
        }

        try {
            adminService.changePassword(email, oldPassword, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}
