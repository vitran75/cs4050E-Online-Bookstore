package com.example.demo.repository;

import com.example.demo.model.BookReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<BookReview, Integer> {
    List<BookReview> findByBook_Id(int id);
}
// This interface extends JpaRepository to provide CRUD operations for Review entities.
// It includes a method to find all reviews associated with a specific book by its ID.