package com.library.lms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 100)
    private String title;
    
    @NotBlank
    @Size(max = 100)
    private String author;
    
    @NotBlank
    @Size(max = 20)
    @Column(unique = true)
    private String isbn;
    
    @Size(max = 1000)
    private String description;
    
    @NotNull
    private Integer publishYear;
    
    @NotNull
    private Integer totalCopies;
    
    @NotNull
    private Integer availableCopies;
    
    @Size(max = 255)
    private String coverImageUrl;
    
    @Column(name = "publication_date")
    private LocalDate publicationDate;
    
    @Size(max = 100)
    private String publisher;
    
    @ManyToMany
    @JoinTable(name = "book_categories",
        joinColumns = @JoinColumn(name = "book_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<Category> categories = new HashSet<>();
    
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Transaction> transactions = new HashSet<>();
} 