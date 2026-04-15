package com.devlil0.sistemadeuniformes.service;

import com.devlil0.sistemadeuniformes.dto.request.PedidoRequest;
import com.devlil0.sistemadeuniformes.dto.response.ClienteResponse;
import com.devlil0.sistemadeuniformes.dto.response.PedidoResponse;
import com.devlil0.sistemadeuniformes.exception.ResourceNotFoundException;
import com.devlil0.sistemadeuniformes.model.ClienteEntity;
import com.devlil0.sistemadeuniformes.model.PedidoEntity;
import com.devlil0.sistemadeuniformes.repository.ClienteRepository;
import com.devlil0.sistemadeuniformes.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;

    public List<PedidoResponse> findAll() {
        return pedidoRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public PedidoResponse findById(Long id) {
        PedidoEntity pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com ID: " + id));
        return toResponse(pedido);
    }

    public PedidoResponse create(PedidoRequest request) {
        PedidoEntity pedido = new PedidoEntity();
        pedido.setStatus(request.getStatus());
        if (request.getClienteId() != null) {
            ClienteEntity cliente = clienteRepository.findById(request.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + request.getClienteId()));
            pedido.setClienteEntity(cliente);
        }
        PedidoEntity saved = pedidoRepository.save(pedido);
        return toResponse(saved);
    }

    public PedidoResponse update(Long id, PedidoRequest request) {
        PedidoEntity pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com ID: " + id));
        pedido.setStatus(request.getStatus());
        if (request.getClienteId() != null) {
            ClienteEntity cliente = clienteRepository.findById(request.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + request.getClienteId()));
            pedido.setClienteEntity(cliente);
        }
        PedidoEntity saved = pedidoRepository.save(pedido);
        return toResponse(saved);
    }

    public void delete(Long id) {
        PedidoEntity pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com ID: " + id));
        pedidoRepository.delete(pedido);
    }

    public PedidoResponse toResponse(PedidoEntity entity) {
        if (entity == null) return null;
        PedidoResponse response = new PedidoResponse();
        response.setId(entity.getId());
        response.setStatus(entity.getStatus());
        response.setCreatedAt(entity.getCreatedAt());
        if (entity.getClienteEntity() != null) {
            ClienteEntity c = entity.getClienteEntity();
            response.setClienteResponse(ClienteResponse.builder()
                    .id(c.getId())
                    .nome(c.getNome())
                    .contato(c.getContato())
                    .build());
        }
        return response;
    }
}
