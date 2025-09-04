package com.example.Back.Controller;

import com.example.Back.Dto.HistoricoDTO;
import com.example.Back.Service.HistoricoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/historico")
public class HistoricoController {

    private final HistoricoService historicoService;

    // Injeção de dependências via construtor
    public HistoricoController(HistoricoService historicoService) {
        this.historicoService = historicoService;
    }

    // Único método: busca e retorna a lista completa do histórico
    @GetMapping
    public ResponseEntity<List<HistoricoDTO>> getAllHistorico() {
        List<HistoricoDTO> historicos = historicoService.getAllHistorico();
        return ResponseEntity.ok(historicos);
    }
}
