package com.mdmq.codigomunicipal.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.mdmq.codigomunicipal.models.ArticuloNode;

public interface ArticuloNodeRepository extends MongoRepository<ArticuloNode, String> {
    
}
