package com.example.demo.model; 


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;

@Entity
@Table(name = "book_promotion")
public class BookPromotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promotion_id")
    private int id;

    @Column(name = "details", nullable = false, columnDefinition = "TEXT")
    private String details;

    @Column(name = "discount", nullable = false, precision = 5, scale = 2)
    private BigDecimal discount;

    @Column(name = "valid_until")
    private Date validUntil;

    @Column(name = "code", length = 6, nullable = false, unique = true)
    private String code;

    public BookPromotion() {}

    public BookPromotion(String details, BigDecimal discount, Date validUntil, String code) {
        this.details = details;
        this.discount = discount;
        this.validUntil = validUntil;
        this.code = code;
    }

    // Getters and setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public Date getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(Date validUntil) {
        this.validUntil = validUntil;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Override
    public String toString() {
        return "BookPromotion{" +
                "id=" + id +
                ", details='" + details + '\'' +
                ", discount=" + discount +
                ", validUntil=" + validUntil +
                ", code='" + code + '\'' +
                '}';
    }
}
