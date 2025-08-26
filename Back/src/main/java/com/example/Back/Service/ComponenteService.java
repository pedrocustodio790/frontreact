package com.example.Back.Service;

import com.example.Back.Entity.Componente;
import com.example.Back.Entity.Historico;
import com.example.Back.Entity.TipoMovimentacao;
import com.example.Back.Repository.ComponenteRepository;
import com.example.Back.Repository.HistoricoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ComponenteService {

    @Autowired
    private ComponenteRepository componenteRepository;

    @Autowired
    private HistoricoRepository historicoRepository;

    public List<Componente> listarTodosComponentes() {
        return componenteRepository.findAll();
    }

    public Optional<Componente> encontrarPorId(Long id) {
        return componenteRepository.findById(id);
    }

    @Transactional
    public Componente salvarComponente(Componente componente) {
        if (componente.getId() != null) {
            // É uma ATUALIZAÇÃO
            // 1. BUSCA a entidade existente do banco de dados.
            Componente componenteExistente = componenteRepository.findById(componente.getId())
                    .orElseThrow(() -> new RuntimeException("Componente não encontrado"));

            int quantidadeAntiga = componenteExistente.getQuantidade();

            // 2. ATUALIZA apenas os campos que vieram do frontend.
            componenteExistente.setNome(componente.getNome());
            componenteExistente.setCodigoPatrimonio(componente.getCodigoPatrimonio());
            componenteExistente.setQuantidade(componente.getQuantidade());
            componenteExistente.setLocalizacao(componente.getLocalizacao());
            componenteExistente.setCategoria(componente.getCategoria());
            componenteExistente.setObservacoes(componente.getObservacoes());

            // 3. SALVA a entidade que já estava a ser monitorizada, agora com os dados atualizados.
            Componente componenteSalvo = componenteRepository.save(componenteExistente);

            int quantidadeNova = componenteSalvo.getQuantidade();
            int diferenca = quantidadeNova - quantidadeAntiga;

            if (diferenca > 0) {
                criarRegistroHistorico(componenteSalvo, TipoMovimentacao.ENTRADA, diferenca);
            } else if (diferenca < 0) {
                criarRegistroHistorico(componenteSalvo, TipoMovimentacao.SAIDA, Math.abs(diferenca));
            }
            return componenteSalvo;
        } else {
            // É uma CRIAÇÃO (esta parte já estava correta)
            Componente componenteSalvo = componenteRepository.save(componente);
            criarRegistroHistorico(componenteSalvo, TipoMovimentacao.ENTRADA, componenteSalvo.getQuantidade());
            return componenteSalvo;
        }
    }