package com.example.demo.repository;

import com.example.demo.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    Optional<OrderItem> findByBookIdAndBookOrderOrderId(int bookId, int orderId); 

    List<OrderItem> findByBookOrderOrderId(int orderId); 

    List<OrderItem> findByBookId(int bookId); 
}
