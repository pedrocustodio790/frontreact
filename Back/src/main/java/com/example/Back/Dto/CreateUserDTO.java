package com.example.Back.Dto;

import com.example.Back.Entity.UserRole;
import lombok.Data;

@Data
public class CreateUserDTO {
    private String email;
    private String senha;
    private UserRole role;
}
