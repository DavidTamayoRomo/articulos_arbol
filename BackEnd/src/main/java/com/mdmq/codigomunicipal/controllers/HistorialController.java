package com.mdmq.codigomunicipal.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mdmq.codigomunicipal.models.Historial;
import com.mdmq.codigomunicipal.service.HistorialService;

@RestController
@RequestMapping("/api/historial")
@CrossOrigin("*")
public class HistorialController {
     private final HistorialService service;

    @Autowired
    public HistorialController(HistorialService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public List<Historial> getAllByIdArticulo(@PathVariable String id) {
        return service.findAllByIdArticulo(id);
    }



}
