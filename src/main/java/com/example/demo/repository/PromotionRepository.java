package com.example.demo.repository;

import com.example.demo.model.BookPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<BookPromotion, Integer> {
    Optional<BookPromotion> findByCodeIgnoreCase(String code);
}