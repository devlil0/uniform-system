package com.devlil0.sistemadeuniformes.service;

import com.devlil0.sistemadeuniformes.dto.request.EstoqueRequest;
import com.devlil0.sistemadeuniformes.dto.response.ClienteResponse;
import com.devlil0.sistemadeuniformes.dto.response.EstoqueResponse;
import com.devlil0.sistemadeuniformes.dto.response.UniformeResponse;
import com.devlil0.sistemadeuniformes.exception.ResourceNotFoundException;
import com.devlil0.sistemadeuniformes.model.ClienteEntity;
import com.devlil0.sistemadeuniformes.model.EstoqueEntity;
import com.devlil0.sistemadeuniformes.model.UniformeEntity;
import com.devlil0.sistemadeuniformes.repository.ClienteRepository;
import com.devlil0.sistemadeuniformes.repository.EstoqueRepository;
import com.devlil0.sistemadeuniformes.repository.UniformeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EstoqueService {

    private final EstoqueRepository estoqueRepository;
    private final UniformeRepository uniformeRepository;
    private final ClienteRepository clienteRepository;

    public List<EstoqueResponse> findAll() {
        return estoqueRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public EstoqueResponse findById(Long id) {
        EstoqueEntity estoque = estoqueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estoque não encontrado com ID: " + id));
        return toResponse(estoque);
    }

    public EstoqueResponse create(EstoqueRequest request) {
        EstoqueEntity estoque = new EstoqueEntity();
        estoque.setQuantidade(request.getQuantidade());
        estoque.setVinculadoCliente(request.isVinculadoCliente());
        
        if (request.getUniformeId() != null) {
            UniformeEntity uniforme = uniformeRepository.findById(request.getUniformeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Uniforme não encontrado com ID: " + request.getUniformeId()));
            estoque.setUniformeEntity(uniforme);
        }
        
        if (request.getClienteId() != null) {
            ClienteEntity cliente = clienteRepository.findById(request.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + request.getClienteId()));
            estoque.setClienteEntity(cliente);
        }
        
        return toResponse(estoqueRepository.save(estoque));
    }

    public EstoqueResponse update(Long id, EstoqueRequest request) {
        EstoqueEntity estoque = estoqueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estoque não encontrado com ID: " + id));
        
        estoque.setQuantidade(request.getQuantidade());
        estoque.setVinculadoCliente(request.isVinculadoCliente());
        
        if (request.getUniformeId() != null) {
            UniformeEntity uniforme = uniformeRepository.findById(request.getUniformeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Uniforme não encontrado com ID: " + request.getUniformeId()));
            estoque.setUniformeEntity(uniforme);
        }
        
        if (request.getClienteId() != null) {
            ClienteEntity cliente = clienteRepository.findById(request.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + request.getClienteId()));
            estoque.setClienteEntity(cliente);
        }
        
        return toResponse(estoqueRepository.save(estoque));
    }

    public void delete(Long id) {
        EstoqueEntity estoque = estoqueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estoque não encontrado com ID: " + id));
        estoqueRepository.delete(estoque);
    }

    public EstoqueResponse toResponse(EstoqueEntity entity) {
        if (entity == null) return null;
        EstoqueResponse response = new EstoqueResponse();
        response.setId(entity.getId());
        response.setQuantidade(entity.getQuantidade());
        response.setVinculadoCliente(entity.isVinculadoCliente());
        
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
