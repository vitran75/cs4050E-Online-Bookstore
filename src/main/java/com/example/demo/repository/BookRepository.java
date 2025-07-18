package com.example.demo.repository;

import com.example.demo.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
    List<Book> findByGenre(String genre);
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByAuthorsContainingIgnoreCase(String authors);
    List<Book> findByPublisherContainingIgnoreCase(String publisher);
    List<Book> findByIsbnContainingIgnoreCase(String isbn);
    Optional<Book> findByIsbn(String isbn);
    Optional<Book> findFirstByTitleContainingIgnoreCase(String title);

    @Query("SELECT b FROM Book b WHERE " +
        "(:id IS NULL OR b.id = :id) AND " +
        "(:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
        "(:genre IS NULL OR LOWER(b.genre) LIKE LOWER(CONCAT('%', :genre, '%'))) AND " +
        "(:authors IS NULL OR LOWER(b.authors) LIKE LOWER(CONCAT('%', :authors, '%'))) AND " +
        "(:publisher IS NULL OR LOWER(b.publisher) LIKE LOWER(CONCAT('%', :publisher, '%'))) AND " +
        "(:isbn IS NULL OR LOWER(b.isbn) LIKE LOWER(CONCAT('%', :isbn, '%')))")
List<Book> searchBooks(
        @Param("id") Integer id,
        @Param("title") String title,
        @Param("genre") String genre,
        @Param("authors") String authors,
        @Param("publisher") String publisher,
        @Param("isbn") String isbn
);
}
