package com.example.demo.util;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
// This class stores verification codes and their expiration times
// It allows storing, verifying, and removing codes based on email addresses    
@Component
public class VerificationCodeStore {
    private final Map<String, String> codes = new ConcurrentHashMap<>();
    private final Map<String, Long> expirations = new ConcurrentHashMap<>();
    private static final long EXPIRE_MS = 5 * 60 * 1000; // 5 minutes

    public void storeCode(String email, String code) {
        codes.put(email, code);
        expirations.put(email, System.currentTimeMillis() + EXPIRE_MS);
    }

    public boolean verifyCode(String email, String code) {
        Long expires = expirations.get(email);
        if (expires == null || System.currentTimeMillis() > expires) return false;
        return code.equals(codes.get(email));
    }

    public void removeCode(String email) {
        codes.remove(email);
        expirations.remove(email);
    }
}
