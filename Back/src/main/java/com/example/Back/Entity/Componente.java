package com.example.Back.Entity;

import jakarta.persistence.*;
import lombok.Getter; // Usa Getter em vez de Data
import lombok.Setter; // Usa Setter em vez de Data
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Getter // Anotações mais específicas
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "componente")
public class Componente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ... outros campos ...
    private String nome;
    private String codigoPatrimonio;
    private int quantidade;
    private String localizacao;
    private String categoria;
    private String observacoes;
    private int nivelMinimoEstoque;

    // Relação corrigida: sem cascade e orphanRemoval
    @OneToMany(mappedBy = "componente")
    private List<Historico> historicos;

    // Para evitar o loop infinito, podemos excluir o campo 'historicos' do toString()
    @Override
    public String toString() {
        return "Componente{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", quantidade=" + quantidade +
                '}';
    }
}