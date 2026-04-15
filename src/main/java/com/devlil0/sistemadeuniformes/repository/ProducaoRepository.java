package com.devlil0.sistemadeuniformes.repository;


import com.devlil0.sistemadeuniformes.model.ProducaoEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProducaoRepository extends JpaRepository<ProducaoEntity, Long> {

    @EntityGraph(attributePaths = {"pedidoEntity.clienteEntity", "costureiraEntity"})
    Optional<ProducaoEntity> findById(Long id);
}
