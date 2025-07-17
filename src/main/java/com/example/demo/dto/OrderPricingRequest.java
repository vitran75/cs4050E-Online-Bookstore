package com.example.demo.dto;

import java.math.BigDecimal;
import java.util.List;

public class OrderPricingRequest {
    private List<BigDecimal> bookPrices; // List of prices for books in the cart
    private String promoCode; // Optional discount code

    // Getters and Setters
    public List<BigDecimal> getBookPrices() {
        return bookPrices;
    }

    public void setBookPrices(List<BigDecimal> bookPrices) {
        this.bookPrices = bookPrices;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public void setPromoCode(String promoCode) {
        this.promoCode = promoCode;
    }
}