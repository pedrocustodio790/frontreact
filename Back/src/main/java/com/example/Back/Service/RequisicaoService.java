package com.example.Back.Service;

import com.example.Back.Dto.RequisicaoCreateDTO;
import com.example.Back.Entity.Componente;
import com.example.Back.Entity.Requisicao;
import com.example.Back.Entity.Usuario;
import com.example.Back.Repository.ComponenteRepository;
import com.example.Back.Repository.RequisicaoRepository;
import com.example.Back.Repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;

@Service
public class RequisicaoService {

    // ... (Injete os 3 repositórios)
    private final RequisicaoRepository requisicaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ComponenteRepository componenteRepository;

    public RequisicaoService(RequisicaoRepository requisicaoRepository,
                             UsuarioRepository usuarioRepository,
                             ComponenteRepository componenteRepository) {
        this.requisicaoRepository = requisicaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.componenteRepository = componenteRepository;
    }

    // ... (Seus métodos findPendentes, aprovar, recusar) ...


    // ✅ --- NOVO MÉTODO ---
    @Transactional
    public Requisicao createRequisicao(RequisicaoCreateDTO dto) {
        // 1. Acha o usuário que está logado
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        // 2. Acha o componente que ele pediu
        Componente componente = componenteRepository.findById(dto.getComponenteId())
                .orElseThrow(() -> new RuntimeException("Componente não encontrado"));

        // 3. Cria a requisição
        Requisicao req = new Requisicao();
        req.setUsuario(usuario);
        req.setComponente(componente);
        req.setQuantidade(dto.getQuantidade());
        req.setObservacao(dto.getObservacao());
        req.setStatus("PENDENTE"); // <-- O Status padrão
        req.setDataRequisicao(new Date());

        return requisicaoRepository.save(req);
    }
}