package com.devlil0.sistemadeuniformes.repository;
import com.devlil0.sistemadeuniformes.model.ClienteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<ClienteEntity, Long> {


}
