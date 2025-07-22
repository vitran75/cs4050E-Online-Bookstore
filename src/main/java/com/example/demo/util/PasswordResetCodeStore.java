package com.example.demo.util;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * Utility class for temporarily storing password reset codes
 * for bookstore customers with a time-limited expiration.
 */
public class PasswordResetCodeStore {

    // Maps customer email to reset code
    private static final Map<String, String> codeMap = new ConcurrentHashMap<>();

    // Maps customer email to expiration timestamp
    private static final Map<String, Long> expiryMap = new ConcurrentHashMap<>();

    // Reset code expiration time: 10 minutes
    private static final long CODE_EXPIRATION_MS = TimeUnit.MINUTES.toMillis(10);

    /**
     * Stores a password reset code for a given email with an expiration time.
     */
    public static void storeResetCode(String email, String code) {
        codeMap.put(email, code);
        expiryMap.put(email, System.currentTimeMillis() + CODE_EXPIRATION_MS);
    }

    /**
     * Verifies that a reset code is valid and not expired.
     */
    public static boolean isValidResetCode(String email, String submittedCode) {
        Long expiryTime = expiryMap.get(email);

        if (expiryTime == null || System.currentTimeMillis() > expiryTime) {
            return false; // Expired or not found
        }

        return submittedCode.equals(codeMap.get(email));
    }

    /**
     * Removes a reset code after it has been used or expired.
     */
    public static void clearResetCode(String email) {
        codeMap.remove(email);
        expiryMap.remove(email);
    }
}
