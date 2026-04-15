package com.devlil0.sistemadeuniformes.service;

import com.devlil0.sistemadeuniformes.dto.request.ItemPedidoRequest;
import com.devlil0.sistemadeuniformes.dto.response.ItemPedidoResponse;
import com.devlil0.sistemadeuniformes.dto.response.PedidoResponse;
import com.devlil0.sistemadeuniformes.dto.response.UniformeResponse;
import com.devlil0.sistemadeuniformes.dto.response.ClienteResponse;
import com.devlil0.sistemadeuniformes.exception.ResourceNotFoundException;
import com.devlil0.sistemadeuniformes.model.ItemPedidoEntity;
import com.devlil0.sistemadeuniformes.model.PedidoEntity;
import com.devlil0.sistemadeuniformes.model.UniformeEntity;
import com.devlil0.sistemadeuniformes.repository.ItemPedidoRepository;
import com.devlil0.sistemadeuniformes.repository.PedidoRepository;
import com.devlil0.sistemadeuniformes.repository.UniformeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ItemPedidoService {

    private final ItemPedidoRepository itemPedidoRepository;
    private final PedidoRepository pedidoRepository;
    private final UniformeRepository uniformeRepository;

    public List<ItemPedidoResponse> findAll() {
        return itemPedidoRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ItemPedidoResponse findById(Long id) {
        ItemPedidoEntity item = itemPedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item de pedido não encontrado com ID: " + id));
        return toResponse(item);
    }

    public ItemPedidoResponse create(ItemPedidoRequest request) {
        ItemPedidoEntity item = new ItemPedidoEntity();
        item.setQuantidade(request.getQuantidade());
        
        if (request.getPedidoId() != null) {
            PedidoEntity pedido = pedidoRepository.findById(request.getPedidoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com ID: " + request.getPedidoId()));
            item.setPedidoEntity(pedido);
        }
        
        if (request.getUniformeId() != null) {
            UniformeEntity uniforme = uniformeRepository.findById(request.getUniformeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Uniforme não encontrado com ID: " + request.getUniformeId()));
            item.setUniformeEntity(uniforme);
        }
        
        return toResponse(itemPedidoRepository.save(item));
    }

    public ItemPedidoResponse update(Long id, ItemPedidoRequest request) {
        ItemPedidoEntity item = itemPedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item de pedido não encontrado com ID: " + id));
        
        item.setQuantidade(request.getQuantidade());
        
        if (request.getPedidoId() != null) {
            PedidoEntity pedido = pedidoRepository.findById(request.getPedidoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com ID: " + request.getPedidoId()));
            item.setPedidoEntity(pedido);
        }
        
        if (request.getUniformeId() != null) {
            UniformeEntity uniforme = uniformeRepository.findById(request.getUniformeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Uniforme não encontrado com ID: " + request.getUniformeId()));
            item.setUniformeEntity(uniforme);
        }
        
        return toResponse(itemPedidoRepository.save(item));
    }

    public void delete(Long id) {
        ItemPedidoEntity item = itemPedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item de pedido não encontrado com ID: " + id));
        itemPedidoRepository.delete(item);
    }

    public ItemPedidoResponse toResponse(ItemPedidoEntity entity) {
        if (entity == null) return null;
        ItemPedidoResponse response = new ItemPedidoResponse();
        response.setId(entity.getId());
        response.setQuantidade(entity.getQuantidade());
        
        if (entity.getPedidoEntity() != null) {
            PedidoEntity p = entity.getPedidoEntity();
            PedidoResponse pr = new PedidoResponse();
            pr.setId(p.getId());
            pr.setStatus(p.getStatus());
            pr.setCreatedAt(p.getCreatedAt());
            if (p.getClienteEntity() != null) {
                pr.setClienteResponse(ClienteResponse.builder()
                        .id(p.getClienteEntity().getId())
                        .nome(p.getClienteEntity().getNome())
                        .contato(p.getClienteEntity().getContato())
                        .build());
            }
            response.setPedidoResponse(pr);
        }
        
        if (entity.getUniformeEntity() != null) {
            UniformeEntity u = entity.getUniformeEntity();
            UniformeResponse ur = new UniformeResponse();
            ur.setId(u.getId());
            ur.setNome(u.getNome());
            ur.setMalha(u.getMalha());
            ur.setTamanho(u.getTamanho());
            ur.setRefletivo(u.getRefletivo());
            ur.setCor(u.getCor());
            response.setUniformeResponse(ur);
        }
        
        return response;
    }
}
