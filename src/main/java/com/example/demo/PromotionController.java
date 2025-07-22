package com.example.demo;

import com.example.demo.model.BookPromotion;
import com.example.demo.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.Map;
import java.util.Optional;
import java.util.List;
// This controller handles CRUD operations for book promotions in the online bookstore application.
// It provides endpoints to get all promotions, get a promotion by promo code, create a new promotion,
// get a promotion by ID, update a promotion by ID, and delete a promotion by ID
// The controller uses the PromotionService to interact with the underlying data layer.
@RestController
@RequestMapping("/api/promotions")
@CrossOrigin("*")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    // Get all promotions
    @GetMapping
    public ResponseEntity<List<BookPromotion>> getAllPromotions() {
        return ResponseEntity.ok(promotionService.getAllPromotions());
    }

    // Get promotion by promo code
    @GetMapping("/code/{promoCode}")
    public ResponseEntity<?> getPromotionByCode(@PathVariable String promoCode) {
        Optional<BookPromotion> promo = promotionService.getPromotionByCode(promoCode);
        if (promo.isPresent()) {
            return ResponseEntity.ok(promo.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Promotion with code '" + promoCode + "' not found.");
        }
    }

    // Create a new promotion
    @PostMapping
    public ResponseEntity<?> createPromotion(@RequestBody BookPromotion promotion) {
        try {
            BookPromotion newPromotion = promotionService.createPromotion(promotion);
            return ResponseEntity.ok(Map.of("message", "Promotion created successfully.", "promotion", newPromotion));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // Get promotion by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPromotionById(@PathVariable int id) {
        Optional<BookPromotion> promotion = promotionService.getPromotionById(id);
        return promotion.map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.status(404).build());
    }

    // Update promotion by ID
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePromotion(@PathVariable int id, @RequestBody Map<String, Object> updates) {
        try {
            BookPromotion updatedPromotion = promotionService.updatePromotion(id, updates);
            return ResponseEntity.ok(Map.of("message", "Promotion updated successfully.", "promotion", updatedPromotion));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // Delete promotion by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePromotionById(@PathVariable int id) {
        boolean deleted = promotionService.deletePromotionById(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Promotion deleted successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Promotion not found."));
        }
    }
}