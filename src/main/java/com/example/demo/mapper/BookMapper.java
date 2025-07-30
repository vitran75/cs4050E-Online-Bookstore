package com.example.demo.mapper;

import com.example.demo.dto.BookDTO;
import com.example.demo.model.Book;
import com.example.demo.model.BookPrice;
import com.example.demo.model.FormatType;

import java.util.Optional;

public class BookMapper {
    public static BookDTO toDTO(Book book) {
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthors(book.getAuthors());
        dto.setGenre(book.getGenre());
        dto.setDescription(book.getDescription());
        dto.setPublisher(book.getPublisher());
        dto.setIsbn(book.getIsbn());
        dto.setCoverImageUrl(book.getCoverImageUrl());
        dto.setSamplePdfUrl(book.getSamplePdfUrl());

        // Grab the default price if BookPrice list exists
        if (book.getPrices() != null && !book.getPrices().isEmpty()) {
            dto.setPrice(book.getPrices().get(0).getPrice().doubleValue()); // default to first price
        } else {
            dto.setPrice(0.0);
        }

        return dto;
    }

}
