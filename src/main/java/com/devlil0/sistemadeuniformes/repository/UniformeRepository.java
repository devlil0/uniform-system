package com.devlil0.sistemadeuniformes.repository;

import com.devlil0.sistemadeuniformes.model.UniformeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UniformeRepository extends JpaRepository<UniformeEntity, Long> {


}
