package com.devlil0.sistemadeuniformes.service;

import com.devlil0.sistemadeuniformes.dto.request.EntregadorRequest;
import com.devlil0.sistemadeuniformes.dto.response.EntregadorResponse;
import com.devlil0.sistemadeuniformes.exception.ResourceNotFoundException;
import com.devlil0.sistemadeuniformes.model.EntregadorEntity;
import com.devlil0.sistemadeuniformes.repository.EntregadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EntregadorService {

    private final EntregadorRepository entregadorRepository;

    public List<EntregadorResponse> findAll() {
        return entregadorRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public EntregadorResponse findById(Long id) {
        EntregadorEntity entregador = entregadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entregador não encontrado com ID: " + id));
        return toResponse(entregador);
    }

    public EntregadorResponse create(EntregadorRequest request) {
        EntregadorEntity entregador = new EntregadorEntity();
        entregador.setNome(request.getNome());
        entregador.setTelefone(request.getTelefone());
        return toResponse(entregadorRepository.save(entregador));
    }

    public EntregadorResponse update(Long id, EntregadorRequest request) {
        EntregadorEntity entregador = entregadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entregador não encontrado com ID: " + id));
        entregador.setNome(request.getNome());
        entregador.setTelefone(request.getTelefone());
        return toResponse(entregadorRepository.save(entregador));
    }

    public void delete(Long id) {
        EntregadorEntity entregador = entregadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entregador não encontrado com ID: " + id));
        entregadorRepository.delete(entregador);
    }

    public EntregadorResponse toResponse(EntregadorEntity entity) {
        if (entity == null) return null;
        EntregadorResponse response = new EntregadorResponse();
        response.setId(entity.getId());
        response.setNome(entity.getNome());
        response.setTelefone(entity.getTelefone());
        return response;
    }
}
