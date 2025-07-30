package com.example.demo;

import com.example.demo.model.CartItem;
import com.example.demo.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000") // Or your frontend domain
public class CartController {

    @Autowired
    private CartItemRepository cartRepo;

    @PostMapping("/add")
    public CartItem addToCart(@RequestBody CartItem item) {
        // Optional: check if item already exists and increase quantity
        return cartRepo.save(item);
    }

    @GetMapping("/user/{userId}")
    public List<CartItem> getCart(@PathVariable Long userId) {
        return cartRepo.findByUserId(userId);
    }

    @DeleteMapping("/user/{userId}/clear")
    public void clearCart(@PathVariable Long userId) {
        List<CartItem> items = cartRepo.findByUserId(userId);
        cartRepo.deleteAll(items);
    }
}
