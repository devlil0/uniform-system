package com.devlil0.sistemadeuniformes.repository;

import com.devlil0.sistemadeuniformes.model.CostureiraEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CostureiraRepository extends JpaRepository<CostureiraEntity, Long> {
}
