package com.devlil0.sistemadeuniformes.repository;

import com.devlil0.sistemadeuniformes.model.EstoqueEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstoqueRepository extends JpaRepository<EstoqueEntity, Long> {
}
