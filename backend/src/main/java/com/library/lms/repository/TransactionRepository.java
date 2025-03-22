package com.library.lms.repository;

import com.library.lms.model.Book;
import com.library.lms.model.Transaction;
import com.library.lms.model.Transaction.TransactionStatus;
import com.library.lms.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findByUser(User user, Pageable pageable);
    
    Page<Transaction> findByBook(Book book, Pageable pageable);
    
    Page<Transaction> findByStatus(TransactionStatus status, Pageable pageable);
    
    List<Transaction> findByUserAndStatus(User user, TransactionStatus status);
    
    @Query("SELECT t FROM Transaction t WHERE t.status = 'BORROWED' AND t.dueDate < :currentDate")
    List<Transaction> findOverdueTransactions(LocalDateTime currentDate);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user = :user AND t.status = 'BORROWED'")
    Long countActiveBorrowings(User user);
    
    @Query("SELECT t FROM Transaction t WHERE t.status = 'BORROWED' AND t.user = :user AND t.book = :book")
    List<Transaction> findActiveBorrowingsByUserAndBook(User user, Book book);
} 