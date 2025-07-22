package com.example.demo;

import java.util.Collections;
import java.util.List;  // Add this import

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;  // Add this import

import com.example.demo.service.BookService;
import com.example.demo.model.Book;



@Controller

public class ExampleController {
@Autowired
private BookService bookService;
    // Home page
    // This method handles requests to the root URL ("/") and returns the home page view
    // It creates a ModelAndView object, populates it with mock data for featured and coming soon books,
    // and returns the model to be rendered by the view resolver.
    // The home page will display featured books and books that are coming soon.
    @RequestMapping("/")
    public ModelAndView home() {
        ModelAndView model = new ModelAndView("home");

        
        List<Book> featuredBooks = bookService.getAllBooks(); // Use real data

        List<Book> comingSoonBooks = List.of(); // Optional, for future use

        model.addObject("featuredBooks", featuredBooks);
        model.addObject("comingSoonBooks", comingSoonBooks);
        return model;
    }

    //     // Mock data for coming soon books
    //     List<Book> comingSoonBooks = Arrays.asList(
    //             new Book("4", "New Book 1", "Author 1",
    //                     "https://via.placeholder.com/150x225?text=Coming+Soon+1", "Coming June 2023"),
    //             new Book("5", "New Book 2", "Author 2",
    //                     "https://via.placeholder.com/150x225?text=Coming+Soon+2", "Coming July 2023")
    //     );

    //     model.addObject("featuredBooks", featuredBooks);
    //     model.addObject("comingSoonBooks", comingSoonBooks);
    //     return model;
    // }

    @RequestMapping("/search")
    public ModelAndView search(@RequestParam String query, @RequestParam(defaultValue = "title") String filter) {
        ModelAndView model = new ModelAndView("home");

        // You can later replace this with actual filtering logic
        List<Book> featuredBooks = bookService.getBooksByTitle(query);

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

    @RequestMapping("/checkout")
    public ModelAndView checkout() {
        return new ModelAndView("checkout");
    }

    @RequestMapping("/orderHistory")
    public ModelAndView orderHistory() {
        return new ModelAndView("orderHistory");
    }


}
