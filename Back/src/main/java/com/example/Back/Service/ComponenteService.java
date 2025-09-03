package com.example.Back.Service;

import com.example.Back.Dto.ComponenteDTO;
import com.example.Back.Entity.Componente;
import com.example.Back.Entity.Historico;
import com.example.Back.Entity.TipoMovimentacao;
import com.example.Back.Repository.ComponenteRepository;
import com.example.Back.Repository.HistoricoRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ComponenteService {

    private final ComponenteRepository componenteRepository;
    private final HistoricoRepository historicoRepository;
    private final RequisicaoService requisicaoService;

    public ComponenteService(ComponenteRepository componenteRepository, HistoricoRepository historicoRepository, RequisicaoService requisicaoService) {
        this.componenteRepository = componenteRepository;
        this.historicoRepository = historicoRepository;
        this.requisicaoService = requisicaoService;
    }

    // --- MÉTODOS EXISTENTES QUE PRECISAM DE ESTAR AQUI ---

    @Transactional(readOnly = true)
    public List<ComponenteDTO> findAll() {
        return componenteRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ComponenteDTO> search(String termo) {
        if (termo == null || termo.trim().isEmpty()) {
            return findAll();
        }
        return componenteRepository.searchByTermo(termo).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComponenteDTO create(ComponenteDTO dto) {
        if (componenteRepository.existsByCodigoPatrimonio(dto.getCodigoPatrimonio())) {
            throw new IllegalArgumentException("Código de património já está em uso.");
        }
        Componente componente = toEntity(dto);
        Componente componenteSalvo = componenteRepository.save(componente);
        criarRegistroHistorico(componenteSalvo, TipoMovimentacao.ENTRADA, componenteSalvo.getQuantidade());
        return toDTO(componenteSalvo);
    }

    // --- O MÉTODO UPDATE COM A NOVA LÓGICA ---

    @Transactional
    public ComponenteDTO update(Long id, ComponenteDTO dto) {
        Componente componenteExistente = componenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Componente não encontrado com o id: " + id));

        int quantidadeAntiga = componenteExistente.getQuantidade();

        componenteExistente.setNome(dto.getNome());
        componenteExistente.setCodigoPatrimonio(dto.getCodigoPatrimonio());
        componenteExistente.setQuantidade(dto.getQuantidade());
        componenteExistente.setLocalizacao(dto.getLocalizacao());
        componenteExistente.setCategoria(dto.getCategoria());
        componenteExistente.setObservacoes(dto.getObservacoes());
        componenteExistente.setNivelMinimoEstoque(dto.getNivelMinimoEstoque());

        Componente componenteAtualizado = componenteRepository.save(componenteExistente);
        int quantidadeNova = componenteAtualizado.getQuantidade();
        int diferenca = quantidadeNova - quantidadeAntiga;

        if (diferenca != 0) {
            criarRegistroHistorico(componenteAtualizado, diferenca > 0 ? TipoMovimentacao.ENTRADA : TipoMovimentacao.SAIDA, Math.abs(diferenca));
        }

        if (componenteAtualizado.getQuantidade() <= componenteAtualizado.getNivelMinimoEstoque()) {
            requisicaoService.criarRequisicaoParaItem(componenteAtualizado);
            System.out.println("LOG: Nível de estoque baixo para o item " + componenteAtualizado.getNome() + ". Requisição criada.");
        }

        return toDTO(componenteAtualizado);
    }

    @Transactional
    public void delete(Long id) {
        // ... (código do seu método delete)
    }

    // --- MÉTODOS AUXILIARES QUE ESTAVAM A FALTAR ---

    private void criarRegistroHistorico(Componente componente, TipoMovimentacao tipo, int quantidade) {
        String emailUsuario = SecurityContextHolder.getContext().getAuthentication().getName();
        Historico historico = new Historico();
        historico.setComponente(componente);
        historico.setTipo(tipo);
        historico.setQuantidade(quantidade);
        historico.setUsuario(emailUsuario);
        historico.setDataHora(LocalDateTime.now());
        historico.setCodigoMovimentacao(UUID.randomUUID().toString());
        historicoRepository.save(historico);
    }

    private ComponenteDTO toDTO(Componente componente) {
        return new ComponenteDTO(
                componente.getId(),
                componente.getNome(),
                componente.getCodigoPatrimonio(),
                componente.getQuantidade(),
                componente.getLocalizacao(),
                componente.getCategoria(),
                componente.getObservacoes(),
                componente.getNivelMinimoEstoque()
        );
    }

    private Componente toEntity(ComponenteDTO dto) {
        Componente componente = new Componente();
        componente.setNome(dto.getNome());
        componente.setCodigoPatrimonio(dto.getCodigoPatrimonio());
        componente.setQuantidade(dto.getQuantidade());
        componente.setLocalizacao(dto.getLocalizacao());
        componente.setCategoria(dto.getCategoria());
        componente.setObservacoes(dto.getObservacoes());
        componente.setNivelMinimoEstoque(dto.getNivelMinimoEstoque());
        return componente;
    }
}
