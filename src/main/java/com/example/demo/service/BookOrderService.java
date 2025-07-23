package com.example.demo.service;

import com.example.demo.model.BookOrder;
import com.example.demo.model.BookPromotion;
import com.example.demo.repository.BookOrderRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class BookOrderService {

    private final BookOrderRepository bookOrderRepository;

    public BookOrderService(BookOrderRepository bookOrderRepository) {
        this.bookOrderRepository = bookOrderRepository;
    }

    public List<BookOrder> getAllOrders() {
        return bookOrderRepository.findAll();
    }

    public List<BookOrder> getOrdersByCustomerId(int customerId) {
        return bookOrderRepository.findByCustomerUserId(customerId);
    }

    public Optional<BookOrder> getOrderById(int orderId) {
        return bookOrderRepository.findById(orderId);
    }

    public BookOrder createOrder(BookOrder order) {
        calculateOrderAmounts(order);
        return bookOrderRepository.save(order);
    }

    public BookOrder updateOrder(int orderId, BookOrder updatedOrder) {
        return bookOrderRepository.findById(orderId).map(existingOrder -> {
            existingOrder.setPaymentCard(updatedOrder.getPaymentCard());
            existingOrder.setPromotion(updatedOrder.getPromotion());
            existingOrder.setOrderItems(updatedOrder.getOrderItems());
            existingOrder.setStoredShippingFee(updatedOrder.getShippingFee());
            calculateOrderAmounts(existingOrder);
            return bookOrderRepository.save(existingOrder);
        }).orElse(null);
    }

    public boolean deleteOrder(int orderId) {
        if (bookOrderRepository.existsById(orderId)) {
            bookOrderRepository.deleteById(orderId);
            return true;
        }
        return false;
    }

    public BookOrder refundOrder(int orderId) {
        return bookOrderRepository.findById(orderId).map(order -> {
            if (!order.isRefunded()) {
                order.setRefunded(true);
                return bookOrderRepository.save(order);
            }
            return order; // already refunded
        }).orElse(null);
    }

    private void calculateOrderAmounts(BookOrder order) {
        // Triggers recalculation of subtotal, tax, discount, total, etc. via getters
        BigDecimal total = order.getTotalPrice();
        // Save final total if needed (e.g., store in DB), else this triggers internal calculation
    }

    public BigDecimal calculateDiscount(BookOrder order, BookPromotion promotion) {
        if (promotion == null || promotion.getDiscount() == null) return BigDecimal.ZERO;
        BigDecimal rate = promotion.getDiscount().divide(BigDecimal.valueOf(100));
        BigDecimal base = order.getSubtotal().add(order.getShippingFee()).add(order.getTaxAmount());
        return base.multiply(rate);
    }

    public BigDecimal calculateFinalTotal(BookOrder order) {
        return order.getTotalPrice();
    }
} 
