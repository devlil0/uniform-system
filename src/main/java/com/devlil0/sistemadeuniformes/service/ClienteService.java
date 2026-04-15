package com.devlil0.sistemadeuniformes.service;

import com.devlil0.sistemadeuniformes.dto.request.ClienteRequest;
import com.devlil0.sistemadeuniformes.dto.response.ClienteResponse;
import com.devlil0.sistemadeuniformes.exception.ResourceNotFoundException;
import com.devlil0.sistemadeuniformes.model.ClienteEntity;
import com.devlil0.sistemadeuniformes.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public List<ClienteResponse> findAll() {
        return clienteRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ClienteResponse findById(Long id) {
        return clienteRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
    }

    public ClienteResponse create(ClienteRequest request) {
        ClienteEntity cliente = ClienteEntity.builder()
                .nome(request.getNome())
                .contato(request.getContato())
                .build();

        return toResponse(clienteRepository.save(cliente));
    }

    public ClienteResponse update(Long id, ClienteRequest request) {
        ClienteEntity cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        cliente.setNome(request.getNome());
        cliente.setContato(request.getContato());

        return toResponse(clienteRepository.save(cliente));
    }

    public void delete(Long id) {
        ClienteEntity cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
        clienteRepository.delete(cliente);
    }

    public ClienteResponse toResponse(ClienteEntity entity) {
        if (entity == null) return null;
        return ClienteResponse.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .contato(entity.getContato())
                .build();
    }
}
