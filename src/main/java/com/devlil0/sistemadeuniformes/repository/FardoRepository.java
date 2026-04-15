package com.devlil0.sistemadeuniformes.repository;

import com.devlil0.sistemadeuniformes.model.FardoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FardoRepository extends JpaRepository<FardoEntity, Long> {

    @Query("select f from FardoEntity f left join fetch f.pedidoEntity p left join fetch f.entregadorEntity e")
    List<FardoEntity> findAllWithAssociations();

    @Query("select f from FardoEntity f left join fetch f.pedidoEntity p left join fetch f.entregadorEntity e where f.id = :id")
    Optional<FardoEntity> findByIdWithAssociations(@Param("id") Long id);
}
