package com.example.Back.Controller;

import com.example.Back.Dto.RequisicaoCreateDTO;
import com.example.Back.Entity.Requisicao;
import com.example.Back.Service.RequisicaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
    @RestController
    @RequestMapping("/api/requisicoes")
    public class RequisicaoController {

        // ✅ 1. DECLARE O SERVICE
        private final RequisicaoService requisicaoService;

        // ✅ 2. ADICIONE ESTE CONSTRUTOR (ERA O QUE FALTAVA)
        public RequisicaoController(RequisicaoService requisicaoService) {
            this.requisicaoService = requisicaoService;
        }
    @PostMapping
    public ResponseEntity<Requisicao> createRequisicao(@RequestBody @Valid RequisicaoCreateDTO dto) {
        Requisicao novaRequisicao = requisicaoService.createRequisicao(dto);
        return new ResponseEntity<>(novaRequisicao, HttpStatus.CREATED);
    }
}