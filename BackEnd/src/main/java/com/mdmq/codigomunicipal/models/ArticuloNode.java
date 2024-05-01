package com.mdmq.codigomunicipal.models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticuloNode {
    @Id
    private String id;
    private String name;
    private Object content;
    private String state;
    private String referencia;
    private List<ArticuloNode> children;
    private Boolean isVisible;
    private Boolean isExpanded;
    private String id_padre;

    // Getters y setters
}
