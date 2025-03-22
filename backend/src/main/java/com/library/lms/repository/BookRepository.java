package com.library.lms.repository;

import com.library.lms.model.Book;
import com.library.lms.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);
    
    Boolean existsByIsbn(String isbn);
    
    Page<Book> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    Page<Book> findByAuthorContainingIgnoreCase(String author, Pageable pageable);
    
    Page<Book> findByCategoriesIn(List<Category> categories, Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE b.availableCopies > 0")
    Page<Book> findAvailableBooks(Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Book> searchBooks(String query, Pageable pageable);
} 