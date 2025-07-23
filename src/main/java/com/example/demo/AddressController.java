package com.example.demo;

import com.example.demo.model.Address;
import com.example.demo.service.AddressService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Optional;
import java.util.List;

// This controller handles CRUD operations for addresses in the online bookstore application.
@RestController
@RequestMapping("/api/addresses")
@CrossOrigin("*") // Allow frontend calls (adjust CORS settings for production)
public class AddressController {

    private final AddressService addressService;
    // Constructor injection for AddressService
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    // Create a new address
    @PostMapping
    public ResponseEntity<Address> createAddress(@RequestBody Address address) {
        Address saved = addressService.saveAddress(address);
        return ResponseEntity.ok(saved);
    }
    // Update an existing address by ID
    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable int id, @RequestBody Address updatedAddress) {
        Optional<Address> updated = addressService.updateAddress(id, updatedAddress);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get all addresses
    @GetMapping
    public List<Address> getAllAddresses() {
        return addressService.getAllAddresses();
    }

    // Get an address by ID
    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddressById(@PathVariable int id) {
        Optional<Address> address = addressService.getAddressById(id);
        return address.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete an address by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAddress(@PathVariable int id) {
        boolean deleted = addressService.deleteAddress(id);
        if (deleted) {
            return ResponseEntity.ok("Address deleted successfully.");
        } else {
            return ResponseEntity.badRequest().body("Address cannot be deleted. It may still be in use.");
        }
    }
}
