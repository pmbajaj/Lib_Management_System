package com.library.lms.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;
    
    @Column(name = "borrow_date", nullable = false)
    private LocalDateTime borrowDate;
    
    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;
    
    @Column(name = "return_date")
    private LocalDateTime returnDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TransactionStatus status;
    
    @Column(name = "fine_amount")
    private Double fineAmount;
    
    @Column(name = "fine_paid")
    private Boolean finePaid;
    
    @Column(name = "notes", length = 500)
    private String notes;
    
    public enum TransactionStatus {
        BORROWED,
        RETURNED,
        OVERDUE,
        LOST
    }
} 