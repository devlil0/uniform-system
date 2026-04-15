package com.devlil0.sistemadeuniformes.repository;

import com.devlil0.sistemadeuniformes.model.EntregadorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntregadorRepository extends JpaRepository<EntregadorEntity, Long> {
}
