package com.devlil0.sistemadeuniformes.service;

import com.devlil0.sistemadeuniformes.dto.request.CostureiraRequest;
import com.devlil0.sistemadeuniformes.dto.response.CostureiraResponse;
import com.devlil0.sistemadeuniformes.exception.ResourceNotFoundException;
import com.devlil0.sistemadeuniformes.model.CostureiraEntity;
import com.devlil0.sistemadeuniformes.repository.CostureiraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CostureiraService {

    private final CostureiraRepository costureiraRepository;

    public List<CostureiraResponse> findAll() {
        return costureiraRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CostureiraResponse findById(Long id) {
        return costureiraRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Costureira não encontrada"));
    }

    public CostureiraResponse create(CostureiraRequest request) {
        CostureiraEntity costureira = CostureiraEntity.builder()
                .nome(request.getNome())
                .telefone(request.getTelefone())
                .build();

        return toResponse(costureiraRepository.save(costureira));
    }

    public CostureiraResponse update(Long id, CostureiraRequest request) {
        CostureiraEntity costureira = costureiraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Costureira não encontrada"));

        costureira.setNome(request.getNome());
        costureira.setTelefone(request.getTelefone());

        return toResponse(costureiraRepository.save(costureira));
    }

    public void delete(Long id) {
        CostureiraEntity costureira = costureiraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Costureira não encontrada"));
        costureiraRepository.delete(costureira);
    }

    public CostureiraResponse toResponse(CostureiraEntity entity) {
        if (entity == null) return null;
        return CostureiraResponse.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .telefone(entity.getTelefone())
                .build();
    }
}
