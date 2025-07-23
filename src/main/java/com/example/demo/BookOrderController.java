package com.example.demo;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class BookOrderController {

    @Autowired
    private BookOrderRepository bookOrderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/customer/{id}")
    public ResponseEntity<List<BookOrder>> getOrdersByCustomerId(@PathVariable("id") int customerId) {
        List<BookOrder> orders = bookOrderRepository.findByCustomerUserId(customerId);
        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orders);
    }

    @GetMapping
    public ResponseEntity<List<BookOrder>> getAllOrders() {
        return ResponseEntity.ok(bookOrderRepository.findAll());
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<BookOrder> getOrderById(@PathVariable("orderId") int orderId) {
        return bookOrderRepository.findById(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create Order using JWT token
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody BookOrder order, @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract email from token
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractEmail(token);

            // Find customer by email
            Customer customer = customerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            // Link customer and set order metadata
            order.setCustomer(customer);
            order.setOrderDate(LocalDateTime.now());

            // Link order to each item
            for (OrderItem item : order.getOrderItems()) {
                Book book = bookRepository.findById(item.getBook().getId())
                        .orElseThrow(() -> new RuntimeException("Book not found"));
                item.setBook(book);
                item.setOrder(order);
                item.setUnitPrice(book.getPrices().get(0).getPrice()); // get current price
            }

            // 5. Save order
            BookOrder savedOrder = bookOrderRepository.save(order);
            return ResponseEntity.ok(savedOrder);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating order: " + e.getMessage());
        }
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<BookOrder> updateOrder(@PathVariable int orderId, @RequestBody BookOrder updatedOrder) {
        return bookOrderRepository.findById(orderId).map(existingOrder -> {
            updatedOrder.setOrderId(orderId);
            return ResponseEntity.ok(bookOrderRepository.save(updatedOrder));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable int orderId) {
        if (bookOrderRepository.existsById(orderId)) {
            bookOrderRepository.deleteById(orderId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
