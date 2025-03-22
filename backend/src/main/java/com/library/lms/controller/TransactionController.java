package com.library.lms.controller;

import com.library.lms.model.Book;
import com.library.lms.model.Transaction;
import com.library.lms.model.Transaction.TransactionStatus;
import com.library.lms.model.User;
import com.library.lms.payload.request.BorrowRequest;
import com.library.lms.payload.response.MessageResponse;
import com.library.lms.repository.BookRepository;
import com.library.lms.repository.TransactionRepository;
import com.library.lms.repository.UserRepository;
import com.library.lms.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    @Autowired
    TransactionRepository transactionRepository;

    @Autowired
    BookRepository bookRepository;

    @Autowired
    UserRepository userRepository;
    
    private static final int MAX_BORROWINGS_PER_USER = 5;
    private static final int DEFAULT_BORROW_DAYS = 14;

    @GetMapping
    @PreAuthorize("hasRole('LIBRARIAN') or hasRole('ADMIN')")
    public ResponseEntity<Page<Transaction>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "borrowDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<Transaction> transactions = transactionRepository.findAll(pageable);

        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('LIBRARIAN') or hasRole('ADMIN')")
    public ResponseEntity<Page<Transaction>> getUserTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "borrowDate"));
        Page<Transaction> transactions = transactionRepository.findByUser(user, pageable);

        return ResponseEntity.ok(transactions);
    }

    @PostMapping("/borrow")
    @PreAuthorize("hasRole('USER') or hasRole('LIBRARIAN') or hasRole('ADMIN')")
    public ResponseEntity<?> borrowBook(@Valid @RequestBody BorrowRequest borrowRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Book book = bookRepository.findById(borrowRequest.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
        // Check if user already has this book borrowed
        List<Transaction> activeTransactions = transactionRepository.findActiveBorrowingsByUserAndBook(user, book);
        if (!activeTransactions.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("You already have this book borrowed"));
        }
        
        // Check if user has reached maximum allowed borrowings
        Long activeBorrowingsCount = transactionRepository.countActiveBorrowings(user);
        if (activeBorrowingsCount >= MAX_BORROWINGS_PER_USER) {
            return ResponseEntity.badRequest().body(
                    new MessageResponse("You have reached the maximum allowed number of borrowed books (" + MAX_BORROWINGS_PER_USER + ")"));
        }
        
        // Check if book has available copies
        if (book.getAvailableCopies() <= 0) {
            return ResponseEntity.badRequest().body(new MessageResponse("No available copies of this book"));
        }
        
        // Create transaction
        Transaction transaction = Transaction.builder()
                .user(user)
                .book(book)
                .borrowDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plus(DEFAULT_BORROW_DAYS, ChronoUnit.DAYS))
                .status(TransactionStatus.BORROWED)
                .build();
        
        // Update book available copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        return ResponseEntity.ok(savedTransaction);
    }

    @PostMapping("/return/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('LIBRARIAN') or hasRole('ADMIN')")
    public ResponseEntity<?> returnBook(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        // Check if transaction belongs to user (unless admin or librarian)
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_LIBRARIAN"));
        
        if (!isAdmin && !transaction.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("This transaction doesn't belong to you"));
        }
        
        // Check if book is already returned
        if (transaction.getStatus() == TransactionStatus.RETURNED) {
            return ResponseEntity.badRequest().body(new MessageResponse("This book is already returned"));
        }
        
        // Update transaction
        transaction.setReturnDate(LocalDateTime.now());
        transaction.setStatus(TransactionStatus.RETURNED);
        
        // Calculate fine if book is overdue
        if (LocalDateTime.now().isAfter(transaction.getDueDate())) {
            long daysLate = ChronoUnit.DAYS.between(transaction.getDueDate(), LocalDateTime.now());
            double fineAmount = daysLate * 0.50; // $0.50 per day
            transaction.setFineAmount(fineAmount);
            transaction.setFinePaid(false);
        }
        
        // Update book available copies
        Book book = transaction.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);
        
        Transaction updatedTransaction = transactionRepository.save(transaction);
        return ResponseEntity.ok(updatedTransaction);
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('LIBRARIAN') or hasRole('ADMIN')")
    public ResponseEntity<?> getOverdueTransactions() {
        List<Transaction> overdueTransactions = transactionRepository.findOverdueTransactions(LocalDateTime.now());
        return ResponseEntity.ok(overdueTransactions);
    }
} 