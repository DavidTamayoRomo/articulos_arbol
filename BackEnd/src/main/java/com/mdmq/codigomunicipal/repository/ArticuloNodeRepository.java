package com.mdmq.codigomunicipal.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.mdmq.codigomunicipal.models.ArticuloNode;
import java.util.List;

public interface ArticuloNodeRepository extends MongoRepository<ArticuloNode, String> {
    List<ArticuloNode> findByStateIn(List<String> states);
}
