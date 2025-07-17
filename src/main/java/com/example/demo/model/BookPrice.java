package com.example.demo.model; 

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "book_price")
public class BookPrice {

    @Id
    @Column(name = "format")
    @Enumerated(EnumType.STRING)
    private FormatType formatType;

    @Column(nullable = false)
    private BigDecimal price;

    public BookPrice() {}

    public BookPrice(FormatType formatType, BigDecimal price) {
        this.formatType = formatType;
        this.price = price;
    }

    public FormatType getFormatType() {
        return formatType;
    }

    public void setFormatType(FormatType formatType) {
        this.formatType = formatType;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}