package com.example.Back.Controller;

import com.example.Back.Dto.CreateUserDTO;
import com.example.Back.Entity.Usuario;
import com.example.Back.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Este endpoint só pode ser acedido por um ADMIN
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = userService.listarTodosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    // Este endpoint também só pode ser acedido por um ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        userService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Usuario> criarUsuario(@RequestBody CreateUserDTO createUserDTO) {
        Usuario novoUsuario = userService.criarUsuario(createUserDTO);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }
}
