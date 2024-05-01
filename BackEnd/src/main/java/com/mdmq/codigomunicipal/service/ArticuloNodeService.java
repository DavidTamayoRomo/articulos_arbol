package com.mdmq.codigomunicipal.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mdmq.codigomunicipal.models.ArticuloNode;
import com.mdmq.codigomunicipal.repository.ArticuloNodeRepository;

@Service
public class ArticuloNodeService {
    private final ArticuloNodeRepository repository;

    @Autowired
    public ArticuloNodeService(ArticuloNodeRepository repository) {
        this.repository = repository;
    }

    public List<ArticuloNode> findAll(  ) {
        return repository.findAll();
    }

    public Optional<ArticuloNode> findById(String id) {
        return repository.findById(id);
    }

    public ArticuloNode save(ArticuloNode articuloNode) {
        return repository.save(articuloNode);
    }

    public void deleteById(String id) {
        repository.deleteById(id);
    }

    public ArticuloNode findByIdNode(String id) {
        Optional<ArticuloNode> node = repository.findById(id);
        return node.orElse(null);
    }

    /* public void addChild(String parentId, ArticuloNode child) {
        ArticuloNode parent = findByIdNode(parentId);
        if (parent != null) {
            if (parent.getChildren() == null) {
                parent.setChildren(new ArrayList<>());
            }
            // Primero guarda el hijo para obtener su ID generado por MongoDB
            ArticuloNode savedChild = save(child);
            parent.getChildren().add(savedChild);
            save(parent); // Guarda el padre actualizado

            //borrar el hijo creado
            deleteById(savedChild.getId());
        }
    }
 */

   
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
            ArticuloNode savedChild = save(child);
            foundNode.getChildren().add(savedChild);
            //Al nodo parent, agregarle el  nuevo nodo como hijo de foundNode
            updateNodeInParent(parent, foundNode);

            save(parent); // Guarda el padre actualizado

            //borrar el hijo creado
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
        save(parent);

        return parent;
    }

}
