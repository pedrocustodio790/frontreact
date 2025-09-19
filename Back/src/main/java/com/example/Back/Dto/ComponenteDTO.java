package com.example.Back.Dto;

import com.example.Back.Entity.Componente;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComponenteDTO {

    private Long id;
    private String nome;
    private String codigoPatrimonio;
    private int quantidade;
    private String localizacao;
    private String categoria;
    private String observacoes;
    private int nivelMinimoEstoque;

    // Construtor que converte uma Entidade para este DTO
    public ComponenteDTO(Componente componente) {
        this.id = componente.getId();
        this.nome = componente.getNome();
        this.codigoPatrimonio = componente.getCodigoPatrimonio();
        this.quantidade = componente.getQuantidade();
        this.localizacao = componente.getLocalizacao();
        this.categoria = componente.getCategoria();
        this.observacoes = componente.getObservacoes();
        this.nivelMinimoEstoque = componente.getNivelMinimoEstoque();
    }
}