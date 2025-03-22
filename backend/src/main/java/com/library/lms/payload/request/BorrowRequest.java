package com.library.lms.payload.request;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class BorrowRequest {
    @NotNull
    private Long bookId;
} 