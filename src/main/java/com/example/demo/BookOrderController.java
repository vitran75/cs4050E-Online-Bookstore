package com.example.demo;

import com.example.demo.model.BookOrder;
import com.example.demo.repository.BookOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*") // You can restrict this for production
public class BookOrderController {

    private final BookOrderRepository bookOrderRepository;

    @Autowired
    public BookOrderController(BookOrderRepository bookOrderRepository) {
        this.bookOrderRepository = bookOrderRepository;
    }

    // GET /api/orders/customer/{id}
    @GetMapping("/customer/{id}")
    public ResponseEntity<List<BookOrder>> getOrdersByCustomerId(@PathVariable("id") int customerId) {
        List<BookOrder> orders = bookOrderRepository.findByCustomerUserId(customerId);
        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orders);
    }

    // GET /api/orders
    @GetMapping
    public ResponseEntity<List<BookOrder>> getAllOrders() {
        return ResponseEntity.ok(bookOrderRepository.findAll());
    }

    // GET /api/orders/{orderId}
    @GetMapping("/{orderId}")
    public ResponseEntity<BookOrder> getOrderById(@PathVariable("orderId") int orderId) {
        return bookOrderRepository.findById(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/orders
    @PostMapping
    public ResponseEntity<BookOrder> createOrder(@RequestBody BookOrder order) {
        BookOrder savedOrder = bookOrderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    // PUT /api/orders/{orderId}
    @PutMapping("/{orderId}")
    public ResponseEntity<BookOrder> updateOrder(@PathVariable int orderId, @RequestBody BookOrder updatedOrder) {
        return bookOrderRepository.findById(orderId).map(existingOrder -> {
            updatedOrder.setOrderId(orderId);
            return ResponseEntity.ok(bookOrderRepository.save(updatedOrder));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/orders/{orderId}
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable int orderId) {
        if (bookOrderRepository.existsById(orderId)) {
            bookOrderRepository.deleteById(orderId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
