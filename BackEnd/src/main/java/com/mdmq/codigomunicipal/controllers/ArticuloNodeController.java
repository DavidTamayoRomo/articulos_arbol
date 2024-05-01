package com.mdmq.codigomunicipal.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mdmq.codigomunicipal.models.ArticuloNode;
import com.mdmq.codigomunicipal.service.ArticuloNodeService;

@RestController
@RequestMapping("/api/articulos")
@CrossOrigin("*")
public class ArticuloNodeController {
     private final ArticuloNodeService service;

    @Autowired
    public ArticuloNodeController(ArticuloNodeService service) {
        this.service = service;
    }

    @GetMapping
    public List<ArticuloNode> getAllArticulos() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ArticuloNode getArticuloById(@PathVariable String id) {
        return service.findById(id).orElse(null);
    }

    @PostMapping
    public ArticuloNode createArticulo(@RequestBody ArticuloNode articuloNode) {
        return service.save(articuloNode);
    }

    @PostMapping("/addHijo/{id_padre}/{id_hijo}")
    public ArticuloNode addChildrent(@PathVariable String id_padre,@PathVariable String id_hijo, @RequestBody ArticuloNode articuloNode) {
        return service.addChild(id_padre,id_hijo, articuloNode);
    }

    @PutMapping("/{id}")
    public ArticuloNode updateArticulo(@PathVariable String id, @RequestBody ArticuloNode articuloNode) {
        articuloNode.setId(id); // Asegúrate de que el ID sea el correcto
        return service.save(articuloNode);
    }

    @DeleteMapping("/{id}")
    public void deleteArticulo(@PathVariable String id) {
        service.deleteById(id);
    }

    @GetMapping("/findPadre/{id}")
    public ArticuloNode getArticuloByIdPadre(@PathVariable String id) {
        return service.findByIdNode(id);
    }

    @PostMapping("/update/{id_padre}/{id_hijo}")
    public ArticuloNode update(@PathVariable String id_padre,@PathVariable String id_hijo, @RequestBody ArticuloNode articuloNode) {
        return service.updateChildNodeById(id_padre,id_hijo, articuloNode);
    }

    /* @PostMapping("/addHijo/{id}")
    public void addChildrent(@PathVariable String id, @RequestBody ArticuloNode articuloNode) {
        service.addChild(id, articuloNode);
    } */
    
    


}
