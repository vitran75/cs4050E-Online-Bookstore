package com.example.demo;

import com.example.demo.model.BookReview;
import com.example.demo.service.ReviewService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("*")
public class ReviewController {

    private final ReviewService reviewService;


    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Get reviews for a specific book by book ID
    @GetMapping("/book/{bookId}")
    public List<BookReview> getReviewsForBook(@PathVariable int bookId) {
        return reviewService.getReviewsForBook(bookId);
    }

    // Create a review for a book by book ID
    @PostMapping("/book/{id}")
    public ResponseEntity<BookReview> addReviewByBookId(@PathVariable int id, @RequestBody BookReview review) {
        BookReview savedReview = reviewService.addReviewByBookId(id, review);
        return savedReview != null ? ResponseEntity.ok(savedReview) : ResponseEntity.notFound().build();
    }

    // Create a review for a book by book title
    @PostMapping("/book/title/{title}")
    public ResponseEntity<BookReview> addReviewByBookTitle(@PathVariable String title, @RequestBody BookReview review) {
        BookReview savedReview = reviewService.addReviewByBookTitle(title, review);
        return savedReview != null ? ResponseEntity.ok(savedReview) : ResponseEntity.notFound().build();
    }

    // Delete a review by review ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReviewById(@PathVariable int id) {
        boolean deleted = reviewService.deleteReviewById(id);
        if (deleted) {
            return ResponseEntity.ok("Review deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("Review not found.");
        }
    }
}