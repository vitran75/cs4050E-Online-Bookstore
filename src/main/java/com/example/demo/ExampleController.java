package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import java.util.Arrays;
import java.util.List;

@Controller
public class ExampleController {
    @RequestMapping("/")
    public ModelAndView home() {
        ModelAndView model = new ModelAndView("home");

        // Mock data for featured books
        List<Book> featuredBooks = Arrays.asList(
                new Book("1", "The Great Gatsby", "F. Scott Fitzgerald", "https://example.com/book1.jpg", "12.99"),
                new Book("2", "To Kill a Mockingbird", "Harper Lee", "https://example.com/book2.jpg", "10.99"),
                new Book("3", "1984", "George Orwell", "https://example.com/book3.jpg", "9.99")
        );

        // Mock data for coming soon books
        List<Book> comingSoonBooks = Arrays.asList(
                new Book("4", "New Book 1", "Author 1", "https://example.com/coming1.jpg", "Coming June 2023"),
                new Book("5", "New Book 2", "Author 2", "https://example.com/coming2.jpg", "Coming July 2023")
        );

        model.addObject("featuredBooks", featuredBooks);
        model.addObject("comingSoonBooks", comingSoonBooks);
        return model;
    }

    // Simple Book class for mock data
    public static class Book {
        private String id;
        private String title;
        private String author;
        private String imageUrl;
        private String price;

        public Book(String id, String title, String author, String imageUrl, String price) {
            this.id = id;
            this.title = title;
            this.author = author;
            this.imageUrl = imageUrl;
            this.price = price;
        }

        // Add getters for all fields
        public String getId() { return id; }
        public String getTitle() { return title; }
        public String getAuthor() { return author; }
        public String getImageUrl() { return imageUrl; }
        public String getPrice() { return price; }
    }
}
