package com.example.demo.service;

import com.example.demo.model.BookPromotion;
import com.example.demo.model.Customer;
import com.example.demo.repository.PromotionRepository;
import com.example.demo.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.Map;
import java.util.Optional;
import java.util.List;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmailService emailService;

    // Get all promotions
    public List<BookPromotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    // Create new promotion
    public BookPromotion createPromotion(BookPromotion promotion) {
        // Ensure expiration date is stored as java.sql.Date
        if (promotion.getValidUntil() != null) {
            promotion.setValidUntil(new java.sql.Date(promotion.getValidUntil().getTime()));
        }

        if (promotion.getCode() == null || promotion.getCode().length() != 4) {
            throw new IllegalArgumentException("Promo code must be exactly 4 uppercase characters.");
        }

        BookPromotion savedPromotion = promotionRepository.save(promotion);

        // Fetch all subscribed customers
        List<Customer> subscribers = customerRepository.findByIsSubscriberTrue();

        // Send email to each subscriber
        for (Customer customer : subscribers) {
            emailService.sendPromotionEmail(
                customer.getEmail(),
                promotion.getDetails(),
                promotion.getDiscount(),
                promotion.getValidUntil(),
                promotion.getCode()
            );
        }

        return savedPromotion;
    }

    public Optional<BookPromotion> getPromotionByCode(String promoCode) {
        return promotionRepository.findByCodeIgnoreCase(promoCode);
    }

    // Get promotion by ID
    public Optional<BookPromotion> getPromotionById(int id) {
        return promotionRepository.findById(id);
    }

    // Update existing promotion
    public BookPromotion updatePromotion(int id, Map<String, Object> updates) {
        Optional<BookPromotion> existingPromotionOpt = promotionRepository.findById(id);
        if (existingPromotionOpt.isEmpty()) {
            throw new RuntimeException("Promotion not found.");
        }

        BookPromotion promotion = existingPromotionOpt.get();

        if (updates.containsKey("description")) {
            promotion.setDetails((String) updates.get("description"));
        }
        if (updates.containsKey("discount_percentage")) {
            BigDecimal discountPercentage = new BigDecimal(updates.get("discount_percentage").toString());
            if (discountPercentage.compareTo(BigDecimal.ZERO) < 0 || discountPercentage.compareTo(BigDecimal.valueOf(100)) > 0) {
                throw new RuntimeException("Discount percentage must be between 0 and 100.");
            }
            promotion.setDiscount(discountPercentage);
        }
        if (updates.containsKey("expiration_date")) {
            String dateStr = updates.get("expiration_date").toString();
            if (dateStr != null && !dateStr.isEmpty()) {
                promotion.setValidUntil(Date.valueOf(dateStr));
            } else {
                promotion.setValidUntil(null);
            }
        }

        return promotionRepository.save(promotion);
    }

    // Delete promotion by ID
    public boolean deletePromotionById(int id) {
        if (promotionRepository.existsById(id)) {
            promotionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
