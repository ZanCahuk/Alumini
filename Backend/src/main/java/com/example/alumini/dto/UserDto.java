package com.example.alumini.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data 
@AllArgsConstructor 
public class UserDto {
    
    private Long id;
    private String username;
    private String email;
    private LocalDateTime casKreiranja;
}
