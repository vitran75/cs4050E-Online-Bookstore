package com.example.demo.service;

import com.example.demo.model.BookReview;
import com.example.demo.model.Book;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;

    public ReviewService(ReviewRepository reviewRepository, BookRepository bookRepository) {
        this.reviewRepository = reviewRepository;
        this.bookRepository = bookRepository;
    }

    // Add review by book ID
    public BookReview addReviewByBookId(int bookId, BookReview review) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isPresent()) {
            review.setBook(bookOpt.get()); // 🔧 use object, not ID
            return reviewRepository.save(review);
        }
        return null;
    }

    // Add review by book title
    public BookReview addReviewByBookTitle(String title, BookReview review) {
        Optional<Book> bookOpt = bookRepository.findFirstByTitleContainingIgnoreCase(title);
        if (bookOpt.isPresent()) {
            review.setBook(bookOpt.get()); // 🔧 use object, not ID
            return reviewRepository.save(review);
        }
        return null;
    }

    // Get all reviews for a book
    public List<BookReview> getReviewsForBook(int bookId) {
        return reviewRepository.findByBook_Id(bookId); // 🔧 adjust to use object reference
    }

    // Delete review by ID
    public boolean deleteReviewById(int reviewId) {
        if (reviewRepository.existsById(reviewId)) {
            reviewRepository.deleteById(reviewId);
            return true;
        }
        return false;
    }
}
