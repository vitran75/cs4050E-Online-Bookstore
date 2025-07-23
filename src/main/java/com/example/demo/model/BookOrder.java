package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "book_order")
public class BookOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int orderId;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @OneToMany(mappedBy = "bookOrder", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<OrderItem> orderItems;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @ManyToOne
    @JoinColumn(name = "payment_card_id")
    private PaymentCard paymentCard;

    @ManyToOne
    @JoinColumn(name = "promo_id")
    private BookPromotion promotion;

    @Column(name = "is_shipped")
    private boolean isShipped = false;

    @Column(name = "shipping_fee", precision = 10, scale = 2)
    private BigDecimal storedShippingFee;

    @Column(name = "is_refunded")
    private boolean isRefunded = false;

    @Transient
    private final BigDecimal taxRate = BigDecimal.valueOf(0.07); // 7% tax

    // === Transient Calculations ===

    @Transient
    public BigDecimal getSubtotal() {
        if (orderItems == null || orderItems.isEmpty())
            return BigDecimal.ZERO;
        return orderItems.stream()
                .map(OrderItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transient
    public BigDecimal getTaxAmount() {
        return getSubtotal().multiply(taxRate);
    }

    @Transient
    public BigDecimal getShippingFee() {
        return storedShippingFee != null ? storedShippingFee : BigDecimal.ZERO;
    }

    @Transient
    public BigDecimal getDiscountAmount() {
        if (promotion == null || promotion.getDiscount() == null)
            return BigDecimal.ZERO;

        BigDecimal discountRate = promotion.getDiscount().divide(BigDecimal.valueOf(100));
        BigDecimal base = getSubtotal().add(getShippingFee()).add(getTaxAmount());
        return base.multiply(discountRate);
    }

    @Transient
    public BigDecimal getTotalPrice() {
        return getSubtotal()
                .add(getShippingFee())
                .add(getTaxAmount())
                .subtract(getDiscountAmount());
    }

    // === Getters and Setters ===

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public PaymentCard getPaymentCard() {
        return paymentCard;
    }

    public void setPaymentCard(PaymentCard paymentCard) {
        this.paymentCard = paymentCard;
    }

    public BookPromotion getPromotion() {
        return promotion;
    }

    public void setPromotion(BookPromotion promotion) {
        this.promotion = promotion;
    }

    public boolean isShipped() {
        return isShipped;
    }

    public void setShipped(boolean shipped) {
        isShipped = shipped;
    }

    public BigDecimal getStoredShippingFee() {
        return storedShippingFee;
    }

    public void setStoredShippingFee(BigDecimal storedShippingFee) {
        this.storedShippingFee = storedShippingFee;
    }
    public boolean isRefunded() {
        return isRefunded;
    }
    
    public void setRefunded(boolean refunded) {
        isRefunded = refunded;
    }
    
}
