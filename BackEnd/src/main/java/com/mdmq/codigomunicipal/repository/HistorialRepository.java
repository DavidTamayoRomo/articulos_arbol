package com.mdmq.codigomunicipal.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.mdmq.codigomunicipal.models.Historial;
import java.util.List;


public interface HistorialRepository extends MongoRepository<Historial, String> {
    List<Historial> findByIdArticulo(String idArticulo);
}
