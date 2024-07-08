package com.mdmq.codigomunicipal.service;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mdmq.codigomunicipal.models.Historial;
import com.mdmq.codigomunicipal.repository.HistorialRepository;

@Service
public class HistorialService {
    private final HistorialRepository repository;

    @Autowired
    public HistorialService(HistorialRepository repository) {
        this.repository = repository;
    }

    public List<Historial> findAll(  ) {
        return repository.findAll();
    }

    public List<Historial> findAllByIdArticulo( String id ) {
        return repository.findByIdArticulo(id);
    }

    public Optional<Historial> findById(String id) {
        return repository.findById(id);
    }

    public Historial save(Historial historial) {
        return repository.save(historial);
    }

    

}
