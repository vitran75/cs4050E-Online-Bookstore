package com.example.demo.service;

import com.example.demo.model.Book;
import com.example.demo.model.BookReview;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.ReviewRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;

    public BookService(BookRepository bookRepository, ReviewRepository reviewRepository) {
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
    }

    // Flexible search
    public List<Book> searchBooks(Integer id, String title, String genre,
                                  String authors, String publisher, String isbn) {
        List<Book> books = bookRepository.searchBooks(id, title, genre, authors, publisher, isbn);
        books.forEach(this::assignReviewsToBook);
        return books;
    }

    @Transactional
    public List<Book> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        books.forEach(this::assignReviewsToBook);
        return books;
    }

    public Optional<Book> getBookById(int id) {
        Optional<Book> book = bookRepository.findById(id);
        book.ifPresent(this::assignReviewsToBook);
        return book;
    }

    public List<Book> getBooksByTitle(String title) {
        List<Book> books = bookRepository.findByTitleContainingIgnoreCase(title);
        books.forEach(this::assignReviewsToBook);
        return books;
    }

    public List<Book> getBooksByGenre(String genre) {
        List<Book> books = bookRepository.findByGenre(genre);
        books.forEach(this::assignReviewsToBook);
        return books;
    }

    public List<Book> getBooksByAuthor(String authors) {
        List<Book> books = bookRepository.findByAuthorsContainingIgnoreCase(authors);
        books.forEach(this::assignReviewsToBook);
        return books;
    }

    public List<Book> getBooksByPublisher(String publisher) {
        List<Book> books = bookRepository.findByPublisherContainingIgnoreCase(publisher);
        books.forEach(this::assignReviewsToBook);
        return books;
    }

    public Book addBook(Book book) {
        // Link each BookPrice back to the parent Book
        if (book.getPrices() != null) {
            for (var price : book.getPrices()) {
                price.setBook(book);
            }
        }

        return bookRepository.save(book);
    }


    public Book updateBook(int id, Book updatedBook) {
        return bookRepository.findById(id).map(book -> {
            if (updatedBook.getTitle() != null) book.setTitle(updatedBook.getTitle());
            if (updatedBook.getGenre() != null) book.setGenre(updatedBook.getGenre());
            if (updatedBook.getAuthors() != null) book.setAuthors(updatedBook.getAuthors());
            if (updatedBook.getPublisher() != null) book.setPublisher(updatedBook.getPublisher());
            if (updatedBook.getIsbn() != null) book.setIsbn(updatedBook.getIsbn());
            if (updatedBook.getCoverImageUrl() != null) book.setCoverImageUrl(updatedBook.getCoverImageUrl());
            return bookRepository.save(book);
        }).orElse(null);
    }

    public boolean deleteBook(int id) {
        if (bookRepository.existsById(id)) {
            bookRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<BookReview> getReviewsForBookById(int bookId) {
        return reviewRepository.findByBook_Id(bookId);
    }

    public List<BookReview> getReviewsForBookByTitle(String title) {
        Optional<Book> book = bookRepository.findFirstByTitleContainingIgnoreCase(title);
        return book.map(value -> reviewRepository.findByBook_Id(value.getId())).orElseGet(List::of);
    }

    public List<String> getAllPublishers() {
        return bookRepository.findAll().stream()
                .map(Book::getPublisher)
                .filter(p -> p != null && !p.isEmpty())
                .distinct()
                .collect(Collectors.toList());
    }

    private void assignReviewsToBook(Book book) {
        List<BookReview> reviews = reviewRepository.findByBook_Id(book.getId());
        book.setReviews(reviews);
    }
}
