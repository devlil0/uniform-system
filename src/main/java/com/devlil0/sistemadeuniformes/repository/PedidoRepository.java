package com.devlil0.sistemadeuniformes.repository;

import com.devlil0.sistemadeuniformes.model.PedidoEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<PedidoEntity, Long> {

    @EntityGraph(attributePaths = {"clienteEntity"})
    Optional<PedidoEntity> findById(Long id);
}
