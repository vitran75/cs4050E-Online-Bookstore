package com.example.demo.model; 

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

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @ManyToOne
    @JoinColumn(name = "payment_card_id")
    private PaymentCard paymentCard;

    @ManyToOne
    @JoinColumn(name = "promo_id")
    private BookPromotion promotion;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderItem> items;

    @Column(name = "shipping_fee", precision = 10, scale = 2)
    private BigDecimal shippingFee;

    @Column(name = "is_refunded")
    private boolean isRefunded = false;

    @Transient
    private final BigDecimal taxRate = BigDecimal.valueOf(0.07);

    public BookOrder() {}

    public BookOrder(Customer customer, LocalDateTime orderDate,
                     PaymentCard paymentCard, BookPromotion promotion) {
        this.customer = customer;
        this.orderDate = orderDate;
        this.paymentCard = paymentCard;
        this.promotion = promotion;
    }

    @Transient
    public BigDecimal getSubtotal() {
        if (items == null || items.isEmpty()) return BigDecimal.ZERO;
        return items.stream()
                .map(item -> item.getTotalPrice() != null ? item.getTotalPrice() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transient
    public BigDecimal getTaxAmount() {
        return getSubtotal().add(getShippingFee()).multiply(taxRate);
    }

    @Transient
    public BigDecimal getDiscountAmount() {
        if (promotion == null || promotion.getDiscount() == null) return BigDecimal.ZERO;
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

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public BigDecimal getShippingFee() {
        return shippingFee != null ? shippingFee : BigDecimal.ZERO;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }

    public boolean isRefunded() {
        return isRefunded;
    }

    public void setRefunded(boolean refunded) {
        isRefunded = refunded;
    }
}
