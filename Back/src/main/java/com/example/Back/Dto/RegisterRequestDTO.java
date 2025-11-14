package com.example.Back.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Este é o "contrato" do JSON
public record RegisterRequestDTO(
        @NotBlank(message = "Nome não pode estar em branco")
        String nome,

        @NotBlank(message = "Email não pode estar em branco")
        @Email(message = "Email inválido")
        String email,

        @NotBlank(message = "Senha não pode estar em branco")
        @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
        String senha
) {}