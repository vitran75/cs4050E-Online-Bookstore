package com.example.demo.repository;

import com.example.demo.model.BookPrice;
import com.example.demo.model.FormatType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookPriceRepository extends JpaRepository<BookPrice, Long> {
    Optional<BookPrice> findByFormatType(FormatType formatType);
}
