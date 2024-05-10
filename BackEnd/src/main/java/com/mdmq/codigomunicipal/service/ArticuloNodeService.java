package com.mdmq.codigomunicipal.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mdmq.codigomunicipal.models.ArticuloNode;
import com.mdmq.codigomunicipal.models.Historial;
import com.mdmq.codigomunicipal.repository.ArticuloNodeRepository;

@Service
public class ArticuloNodeService {
    private final ArticuloNodeRepository repository;

    @Autowired
    private HistorialService historialService;

    @Autowired
    public ArticuloNodeService(ArticuloNodeRepository repository) {
        this.repository = repository;
    }

    public List<ArticuloNode> findAll() {
        return repository.findAll();
    }

    public Optional<ArticuloNode> findById(String id) {
        return repository.findById(id);
    }

    public ArticuloNode save(ArticuloNode articuloNode) {
        ArticuloNode articulo = repository.save(articuloNode);
        Historial historial = new Historial();
        historial.setChildren(articulo.getChildren());
        historial.setContent(articulo.getContent());
        historial.setContent_transform(articulo.getContent_transform());
        historial.setFecha_creacion(articulo.getFecha_creacion());
        historial.setFecha_modificacion(articulo.getFecha_modificacion());
        historial.setIdArticulo(articulo.getId());
        historial.setId_padre(articulo.getId_padre());
        historial.setIsExpanded(articulo.getIsExpanded());
        historial.setIsVisible(articulo.getIsVisible());
        historial.setName(articulo.getName());
        historial.setReferencia(articulo.getReferencia());
        historial.setState(articulo.getState());
        historial.setFecha_creacion(articulo.getFecha_creacion());
        historial.setFecha_modificacion(articulo.getFecha_modificacion());
        historial.setUsuario_creacion(articulo.getUsuario_creacion());
        historial.setUsuario_modificacion(articulo.getUsuario_modificacion());

        historialService.save(historial);

        return articulo;
    }

    public ArticuloNode saveChildrent(ArticuloNode articuloNode) {
        ArticuloNode articulo = repository.save(articuloNode);

        return articulo;
    }

    public void deleteById(String id) {
        repository.deleteById(id);
    }

    public ArticuloNode findByIdNode(String id) {
        Optional<ArticuloNode> node = repository.findById(id);
        return node.orElse(null);
    }

    public ArticuloNode addChild(String parentId, String targetId, ArticuloNode child) {
        ArticuloNode parent = findByIdNode(parentId);
        if (parent == null) {
            throw new IllegalArgumentException("Nodo padre no encontrado con ID: " + parentId);
        }
        ArticuloNode foundNode = findNodeByIdFromParent(parent, targetId);
        if (foundNode != null) {
            if (foundNode.getChildren() == null) {
                foundNode.setChildren(new ArrayList<>());
            }
            child.setId_padre(parentId);
            // Primero guarda el hijo para obtener su ID generado por MongoDB
            ArticuloNode savedChild = saveChildrent(child);
            foundNode.getChildren().add(savedChild);
            // Al nodo parent, agregarle el nuevo nodo como hijo de foundNode
            updateNodeInParent(parent, foundNode);

            saveChildrent(parent); // Guarda el padre actualizado

            Historial historialUpdate = new Historial();
            historialUpdate.setChildren(savedChild.getChildren());
            historialUpdate.setContent(savedChild.getContent());
            historialUpdate.setContent_transform(savedChild.getContent_transform());
            historialUpdate.setFecha_creacion(savedChild.getFecha_creacion());
            historialUpdate.setFecha_modificacion(savedChild.getFecha_modificacion());
            historialUpdate.setIdArticulo(savedChild.getId());
            historialUpdate.setId_padre(savedChild.getId_padre());
            historialUpdate.setIsExpanded(savedChild.getIsExpanded());
            historialUpdate.setIsVisible(savedChild.getIsVisible());
            historialUpdate.setName(savedChild.getName());
            historialUpdate.setReferencia(savedChild.getReferencia());
            historialUpdate.setState(savedChild.getState());
            historialUpdate.setFecha_creacion(savedChild.getFecha_creacion());
            historialUpdate.setFecha_modificacion(savedChild.getFecha_modificacion());
            historialUpdate.setUsuario_creacion(savedChild.getUsuario_creacion());
            historialUpdate.setUsuario_modificacion(savedChild.getUsuario_modificacion());

            historialService.save(historialUpdate);

            // borrar el hijo creado
            deleteById(savedChild.getId());
        }
        return foundNode;
    }

    public ArticuloNode findNodeByIdFromParent(ArticuloNode root, String targetId) {
        if (root == null) {
            return null;
        }
        // Verifica si el nodo actual es el nodo que buscas
        if (root.getId().equals(targetId)) {
            return root;
        }
        // Recorre los hijos para buscar el nodo por ID
        if (root.getChildren() != null) {
            for (ArticuloNode child : root.getChildren()) {
                ArticuloNode foundNode = findNodeByIdFromParent(child, targetId);
                if (foundNode != null) {
                    return foundNode;
                }
            }
        }
        // Si no se encuentra, retorna null
        return null;
    }

    private void updateNodeInParent(ArticuloNode parent, ArticuloNode updatedNode) {
        if (parent == null || updatedNode == null) {
            return;
        }

        if (parent.getId().equals(updatedNode.getId())) {
            // Si el nodo padre es el nodo actualizado, no se requiere acción adicional
            parent.setChildren(updatedNode.getChildren());
            parent.setContent(updatedNode.getContent());
            parent.setContent_transform(updatedNode.getContent_transform());
            parent.setFecha_creacion(updatedNode.getFecha_creacion());
            parent.setFecha_modificacion(new Date());
            parent.setId(updatedNode.getId());
            parent.setId_padre(updatedNode.getId_padre());
            parent.setIsExpanded(updatedNode.getIsExpanded());
            parent.setIsVisible(updatedNode.getIsVisible());
            parent.setName(updatedNode.getName());
            parent.setReferencia(updatedNode.getReferencia());
            parent.setState(updatedNode.getState());
            parent.setFecha_creacion(updatedNode.getFecha_creacion());
            parent.setFecha_modificacion(updatedNode.getFecha_modificacion());
            parent.setUsuario_creacion(updatedNode.getUsuario_creacion());
            parent.setUsuario_modificacion(updatedNode.getUsuario_modificacion());
            return;
        }

        if (parent.getChildren() != null) {
            for (int i = 0; i < parent.getChildren().size(); i++) {
                ArticuloNode child = parent.getChildren().get(i);

                if (child.getId().equals(updatedNode.getId())) {
                    // Reemplaza el nodo hijo con el nodo actualizado
                    parent.getChildren().set(i, updatedNode);
                    return; // Una vez reemplazado, no necesitas seguir buscando
                } else {
                    // Recorre recursivamente para encontrar y reemplazar el nodo
                    updateNodeInParent(child, updatedNode);
                }
            }
        }
    }

    public ArticuloNode updateChildNodeById(String parentId, String childId, ArticuloNode updatedChild) {
        // Encuentra el nodo padre
        ArticuloNode parent = findByIdNode(parentId);
        if (parent == null) {
            throw new IllegalArgumentException("Nodo padre no encontrado con ID: " + parentId);
        }

        // Encuentra el nodo hijo específico en el nodo padre
        ArticuloNode foundChild = findNodeByIdFromParent(parent, childId);
        if (foundChild == null) {
            throw new IllegalArgumentException("Nodo hijo no encontrado con ID: " + childId);
        }

        // Reemplaza el nodo hijo con el nodo actualizado
        updateNodeInParent(parent, updatedChild);

        // Guarda el nodo padre actualizado
        saveChildrent(parent);

        Historial historialUpdatePadreHijos = new Historial();
        historialUpdatePadreHijos.setChildren(updatedChild.getChildren());
        historialUpdatePadreHijos.setContent(updatedChild.getContent());
        historialUpdatePadreHijos.setContent_transform(updatedChild.getContent_transform());
        historialUpdatePadreHijos.setFecha_creacion(updatedChild.getFecha_creacion());
        historialUpdatePadreHijos.setFecha_modificacion(updatedChild.getFecha_modificacion());
        historialUpdatePadreHijos.setIdArticulo(updatedChild.getId());
        historialUpdatePadreHijos.setId_padre(updatedChild.getId_padre());
        historialUpdatePadreHijos.setIsExpanded(updatedChild.getIsExpanded());
        historialUpdatePadreHijos.setIsVisible(updatedChild.getIsVisible());
        historialUpdatePadreHijos.setName(updatedChild.getName());
        historialUpdatePadreHijos.setReferencia(updatedChild.getReferencia());
        historialUpdatePadreHijos.setState(updatedChild.getState());
        historialUpdatePadreHijos.setFecha_creacion(updatedChild.getFecha_creacion());
        historialUpdatePadreHijos.setFecha_modificacion(updatedChild.getFecha_modificacion());
        historialUpdatePadreHijos.setUsuario_creacion(updatedChild.getUsuario_creacion());
        historialUpdatePadreHijos.setUsuario_modificacion(updatedChild.getUsuario_modificacion());
        historialService.save(historialUpdatePadreHijos);

        return parent;
    }

}
