package com.security.authX_backend.exceptions;

import com.security.authX_backend.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException exception , HttpServletRequest request)
    {
        ErrorResponse response = new ErrorResponse(
                exception.getMessage(),
                HttpStatus.NOT_FOUND,
                "Interval Server Error",
                LocalDateTime.now(),
                request.getRequestURI()

        );
        return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException exception , HttpServletRequest request)
    {
        ErrorResponse response = new ErrorResponse(
                exception.getMessage(),
                HttpStatus.BAD_REQUEST,
                "Interval Server Error",
                LocalDateTime.now(),
                request.getRequestURI()

        );
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

}
