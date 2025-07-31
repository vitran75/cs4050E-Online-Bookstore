package com.example.demo;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.example.demo.service.EmailService;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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

    @Autowired
    private EmailService emailService;

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

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody BookOrder order, @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractEmail(token);

            Customer customer = customerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            order.setCustomer(customer);
            order.setOrderDate(LocalDateTime.now());

            // STEP 1: Temporarily detach items
            List<OrderItem> detachedItems = order.getOrderItems();
            order.setOrderItems(null);

            // STEP 2: Save the parent order and get the generated order_id
            BookOrder savedOrder = bookOrderRepository.save(order);

            // STEP 3: Set order and details on each item
            for (OrderItem item : detachedItems) {
                Book book = bookRepository.findById(item.getBook().getId())
                        .orElseThrow(() -> new RuntimeException("Book not found"));

                item.setBook(book);
                item.setBookOrder(savedOrder);
                item.setUnitPrice(book.getPrices().get(0).getPrice());
            }

            // STEP 4: Save the order again with items attached
            savedOrder.setOrderItems(detachedItems);
            BookOrder finalOrder = bookOrderRepository.save(savedOrder);

            // STEP 5: Calculate total
            BigDecimal subtotal = finalOrder.getOrderItems().stream()
                    .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal shipping = finalOrder.getShippingFee() != null ? finalOrder.getShippingFee() : BigDecimal.ZERO;
            BigDecimal tax = BigDecimal.ZERO;      // Replace with actual tax logic
            BigDecimal discount = BigDecimal.ZERO; // Replace with promo logic
            BigDecimal total = subtotal.add(shipping).add(tax).subtract(discount);

            // STEP 6: Send confirmation email
            emailService.sendOrderConfirmationEmail(
                    customer.getEmail(),
                    finalOrder.getOrderId(),
                    finalOrder.getOrderItems(),
                    customer.getFirstName(),
                    finalOrder.getOrderDate(),
                    total,
                    tax,
                    shipping,
                    discount
            );

            return ResponseEntity.ok(finalOrder);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating order: " + e.getMessage());
        }
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<BookOrder> updateOrder(@PathVariable int orderId,
                                                 @RequestBody BookOrder updatedOrder) {
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
