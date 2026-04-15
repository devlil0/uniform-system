package com.devlil0.sistemadeuniformes.service;

import com.devlil0.sistemadeuniformes.dto.request.UniformeRequest;
import com.devlil0.sistemadeuniformes.dto.response.UniformeResponse;
import com.devlil0.sistemadeuniformes.exception.ResourceNotFoundException;
import com.devlil0.sistemadeuniformes.model.UniformeEntity;
import com.devlil0.sistemadeuniformes.repository.UniformeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UniformeService {

    private final UniformeRepository uniformeRepository;

    public List<UniformeResponse> findAll() {
        return uniformeRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UniformeResponse findById(Long id) {
        UniformeEntity uniforme = uniformeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Uniforme não encontrado com ID: " + id));
        return toResponse(uniforme);
    }

    public UniformeResponse create(UniformeRequest request) {
        UniformeEntity uniforme = new UniformeEntity();
        uniforme.setNome(request.getNome());
        uniforme.setMalha(request.getMalha());
        uniforme.setTamanho(request.getTamanho());
        uniforme.setRefletivo(request.getRefletivo());
        uniforme.setCor(request.getCor());
        return toResponse(uniformeRepository.save(uniforme));
    }

    public UniformeResponse update(Long id, UniformeRequest request) {
        UniformeEntity uniforme = uniformeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Uniforme não encontrado com ID: " + id));
        uniforme.setNome(request.getNome());
        uniforme.setMalha(request.getMalha());
        uniforme.setTamanho(request.getTamanho());
        uniforme.setRefletivo(request.getRefletivo());
        uniforme.setCor(request.getCor());
        return toResponse(uniformeRepository.save(uniforme));
    }

    public void delete(Long id) {
        UniformeEntity uniforme = uniformeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Uniforme não encontrado com ID: " + id));
        uniformeRepository.delete(uniforme);
    }

    public UniformeResponse toResponse(UniformeEntity entity) {
        if (entity == null) return null;
        UniformeResponse response = new UniformeResponse();
        response.setId(entity.getId());
        response.setNome(entity.getNome());
        response.setMalha(entity.getMalha());
        response.setTamanho(entity.getTamanho());
        response.setRefletivo(entity.getRefletivo());
        response.setCor(entity.getCor());
        return response;
    }
}
