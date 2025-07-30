package com.example.demo.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "book")   
public class Book {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;
    private String genre;
    private String authors;
    private String publisher;
    private String description;
    private String coverImageUrl;
    private String samplePdfUrl;

    @Column(name = "isbn")
    private String isbn;

    @Transient
    private List<String> authorList;

    @Transient
    private List<BookReview> reviews;

    @Transient
    private BigDecimal price;

    @JsonManagedReference
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<BookPrice> prices;



    public Book() {}

    public Book(String title, String genre, String authors, String publisher,
                String description, String coverImageUrl, String samplePdfUrl, String isbn) {
        this.title = title;
        this.genre = genre;
        this.authors = authors;
        this.publisher = publisher;
        this.description = description;
        this.coverImageUrl = coverImageUrl;
        this.samplePdfUrl = samplePdfUrl;
        this.isbn = isbn;
    }


    @PostLoad

    private void afterLoad() {
        // Author parsing
        if (this.authors != null) {
            this.authorList = Arrays.stream(this.authors.split(", "))
                    .map(String::trim)
                    .collect(Collectors.toList());
        }

        // Default price extraction
        if (prices != null && !prices.isEmpty()) {
            this.price = prices.get(0).getPrice(); // or filter by format type
        }
    }


    public List<String> getAuthorList() {
        return authorList;
    }

    public List<BookReview> getReviews() {
        return reviews;
    }

    public void setReviews(List<BookReview> reviews) {
        this.reviews = reviews;
    }
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getAuthors() {
        return authors;
    }

    public void setAuthors(String authors) {
        this.authors = authors;
        afterLoad();
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public String getSamplePdfUrl() {
        return samplePdfUrl;
    }

    public void setSamplePdfUrl(String samplePdfUrl) {
        this.samplePdfUrl = samplePdfUrl;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }



public List<BookPrice> getPrices() {
    return prices;
}

public void setPrices(List<BookPrice> prices) {
    this.prices = prices;
}


public BigDecimal getPrice() {
        return price;
}


} 