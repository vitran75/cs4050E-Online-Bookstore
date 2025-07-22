package com.example.demo.util;

import java.util.Random;
// Utility class for generating verification codes
// This class provides a method to generate a random 6-digit verification code

public class VerificationUtil {
    public static String generateCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }
}