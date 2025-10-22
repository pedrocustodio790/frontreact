package com.example.Back.Controller;

import com.example.Back.Dto.CreateUserDTO;
import com.example.Back.Dto.PasswordChangeDTO;
import com.example.Back.Dto.UpdateRoleDTO; // Importe o DTO que você criou
import com.example.Back.Dto.UsuarioDTO;
import com.example.Back.Entity.UserRole;
import com.example.Back.Service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users") // O RequestMapping correto que você já tinha
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioDTO>> getAllUsers() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioDTO> createUser(@RequestBody @Valid CreateUserDTO createUserDTO) {
        UsuarioDTO novoUsuario = usuarioService.createUser(createUserDTO);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }

    // --- MÉTODO CORRIGIDO (usando UpdateRoleDTO) ---
    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioDTO> changeUserRole(@PathVariable Long id, @RequestBody UpdateRoleDTO dto) {
        // Precisamos garantir que seu service aceite o "UserRole" e não o DTO
        return ResponseEntity.ok(usuarioService.changeUserRole(id, dto.role()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        usuarioService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> changeCurrentUserPassword(
            Authentication authentication,
            @RequestBody @Valid PasswordChangeDTO passwordChangeDTO
    ) {
        try {
            String userEmail = authentication.getName();
            usuarioService.changePassword(userEmail, passwordChangeDTO);
            return ResponseEntity.ok("Senha alterada com sucesso.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}