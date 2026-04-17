package com.devlil0.sistemadeuniformes.repository;

import com.devlil0.sistemadeuniformes.model.EntregaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntregaRepository extends JpaRepository<EntregaEntity, Long> {
}
