package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;  // Add this import
import org.springframework.web.servlet.ModelAndView;
import java.util.Arrays;
import java.util.List;
import java.util.Collections;  // Add this import

@Controller
public class ExampleController {
    @RequestMapping("/")
    public ModelAndView home() {
        ModelAndView model = new ModelAndView("home");

        // Mock data for featured books
        List<Book> featuredBooks = Arrays.asList(
                new Book("1", "The Great Gatsby", "F. Scott Fitzgerald",
                        "https://via.placeholder.com/150x225?text=Gatsby", "12.99"),
                new Book("2", "To Kill a Mockingbird", "Harper Lee",
                        "https://via.placeholder.com/150x225?text=Mockingbird", "10.99"),
                new Book("3", "1984", "George Orwell",
                        "https://via.placeholder.com/150x225?text=1984", "9.99")
        );

        // Mock data for coming soon books
        List<Book> comingSoonBooks = Arrays.asList(
                new Book("4", "New Book 1", "Author 1",
                        "https://via.placeholder.com/150x225?text=Coming+Soon+1", "Coming June 2023"),
                new Book("5", "New Book 2", "Author 2",
                        "https://via.placeholder.com/150x225?text=Coming+Soon+2", "Coming July 2023")
        );

        model.addObject("featuredBooks", featuredBooks);
        model.addObject("comingSoonBooks", comingSoonBooks);
        return model;
    }

    @RequestMapping("/search")
    public ModelAndView search(@RequestParam String query, @RequestParam(defaultValue = "title") String filter) {
        ModelAndView model = new ModelAndView("home");

        // For now, just return the same mock data
        // In a real app, this would filter books based on the query
        List<Book> featuredBooks = Arrays.asList(
                new Book("1", "The Great Gatsby", "F. Scott Fitzgerald",
                        "https://via.placeholder.com/150x225?text=Gatsby", "12.99"),
                new Book("2", "To Kill a Mockingbird", "Harper Lee",
                        "https://via.placeholder.com/150x225?text=Mockingbird", "10.99"),
                new Book("3", "1984", "George Orwell",
                "https://via.placeholder.com/150x225?text=1984", "9.99")
        );

        model.addObject("featuredBooks", featuredBooks);
        model.addObject("comingSoonBooks", Collections.emptyList());
        model.addObject("searchQuery", query);
        model.addObject("searchFilter", filter);
        return model;
    }

    @RequestMapping("/profile")
    public String profile() {
        return "redirect:/"; // Just redirect to home for now
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
    // Admin home page
    @RequestMapping("/admin")
    public ModelAndView adminHome() {
        return new ModelAndView("adminHome"); // Renders /WEB-INF/jsp/adminHome.jsp
    }

    // Admin books page
    @RequestMapping("/admin/books")
    public ModelAndView adminBooks() {
        // You can later add model attributes like book list here
        return new ModelAndView("adminBooks");
    }

    // Admin users page
    @RequestMapping("/admin/users")
    public ModelAndView adminUsers() {
        return new ModelAndView("adminUsers");
    }

    // Admin promotions page
    @RequestMapping("/admin/promotions")
    public ModelAndView adminPromotions() {
        return new ModelAndView("adminPromotions");
    }

}
