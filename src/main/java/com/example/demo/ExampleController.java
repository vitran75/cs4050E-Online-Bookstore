package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;


@Controller
public class ExampleController {

    @RequestMapping("/")
    public String home() {
        return "home"; // This must match your JSP file name (home.jsp)
    }

    @RequestMapping("/next")
    public ModelAndView next(ModelAndView model) {
        model.setViewName("next");

        return model;
    }
}