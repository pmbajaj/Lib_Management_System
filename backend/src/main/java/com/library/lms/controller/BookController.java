package com.library.lms.controller;

import com.library.lms.model.Book;
import com.library.lms.model.Category;
import com.library.lms.payload.response.MessageResponse;
import com.library.lms.repository.BookRepository;
import com.library.lms.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/books")
public class BookController {
    @Autowired
    BookRepository bookRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @GetMapping("/public/all")
    public ResponseEntity<Page<Book>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<Book> books = bookRepository.findAll(pageable);

        return ResponseEntity.ok(books);
    }

    @GetMapping("/public/available")
    public ResponseEntity<Page<Book>> getAvailableBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Book> books = bookRepository.findAvailableBooks(pageable);

        return ResponseEntity.ok(books);
    }

    @GetMapping("/public/search")
    public ResponseEntity<Page<Book>> searchBooks(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Book> books = bookRepository.searchBooks(query, pageable);

        return ResponseEntity.ok(books);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<?> getBookById(@PathVariable Long id) {
        return bookRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('LIBRARIAN') or hasRole('ADMIN')")
    public ResponseEntity<?> addBook(@Valid @RequestBody Book book) {
        if (bookRepository.existsByIsbn(book.getIsbn())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: ISBN already exists!"));
        }

        Set<Category> categories = new HashSet<>();
        if (book.getCategories() != null) {
            book.getCategories().forEach(category -> {
                Category foundCategory = categoryRepository.findByName(category.getName())
                        .orElseGet(() -> {
                            Category newCategory = new Category();
                            newCategory.setName(category.getName());
                            newCategory.setDescription(category.getDescription());
                            return categoryRepository.save(newCategory);
                        });
                categories.add(foundCategory);
            });
        }
        book.setCategories(categories);

        Book savedBook = bookRepository.save(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBook);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('LIBRARIAN') or hasRole('ADMIN')")
    public ResponseEntity<?> updateBook(@PathVariable Long id, @Valid @RequestBody Book bookDetails) {
        return bookRepository.findById(id)
                .map(book -> {
                    book.setTitle(bookDetails.getTitle());
                    book.setAuthor(bookDetails.getAuthor());
                    book.setDescription(bookDetails.getDescription());
                    book.setPublishYear(bookDetails.getPublishYear());
                    book.setPublisher(bookDetails.getPublisher());
                    book.setTotalCopies(bookDetails.getTotalCopies());
                    book.setAvailableCopies(bookDetails.getAvailableCopies());
                    book.setCoverImageUrl(bookDetails.getCoverImageUrl());
                    book.setPublicationDate(bookDetails.getPublicationDate());

                    // Update categories
                    Set<Category> categories = new HashSet<>();
                    if (bookDetails.getCategories() != null) {
                        bookDetails.getCategories().forEach(category -> {
                            Category foundCategory = categoryRepository.findByName(category.getName())
                                    .orElseGet(() -> {
                                        Category newCategory = new Category();
                                        newCategory.setName(category.getName());
                                        newCategory.setDescription(category.getDescription());
                                        return categoryRepository.save(newCategory);
                                    });
                            categories.add(foundCategory);
                        });
                    }
                    book.setCategories(categories);

                    return ResponseEntity.ok(bookRepository.save(book));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        return bookRepository.findById(id)
                .map(book -> {
                    bookRepository.delete(book);
                    return ResponseEntity.ok(new MessageResponse("Book deleted successfully!"));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
} 