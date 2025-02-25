package com.mdmq.codigomunicipal.models;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "CONTENIDO")
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
    private String content_transform;
    private String usuario_creacion;
    private String usuario_modificacion;
    private Date fecha_creacion;
    private Date fecha_modificacion;

    // Getters y setters
}
