package com.devlil0.sistemadeuniformes.service;

import com.devlil0.sistemadeuniformes.dto.request.EntregaRequest;
import com.devlil0.sistemadeuniformes.dto.response.EntregadorResponse;
import com.devlil0.sistemadeuniformes.dto.response.EntregaResponse;
import com.devlil0.sistemadeuniformes.dto.response.FardoResponse;
import com.devlil0.sistemadeuniformes.exception.ResourceNotFoundException;
import com.devlil0.sistemadeuniformes.model.EntregadorEntity;
import com.devlil0.sistemadeuniformes.model.EntregaEntity;
import com.devlil0.sistemadeuniformes.model.FardoEntity;
import com.devlil0.sistemadeuniformes.repository.EntregadorRepository;
import com.devlil0.sistemadeuniformes.repository.EntregaRepository;
import com.devlil0.sistemadeuniformes.repository.FardoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EntregaService {

    private final EntregaRepository entregaRepository;
    private final FardoRepository fardoRepository;
    private final EntregadorRepository entregadorRepository;
    private final FardoService fardoService;

    public List<EntregaResponse> findAll() {
        return entregaRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public EntregaResponse findById(Long id) {
        EntregaEntity entrega = entregaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entrega não encontrada com ID: " + id));
        return toResponse(entrega);
    }

    public EntregaResponse create(EntregaRequest request) {
        EntregaEntity entrega = new EntregaEntity();
        entrega.setDataEntrega(request.getDataEntrega());
        entrega.setStatus(request.getStatus());
        entrega.setObservacao(request.getObservacao());

        FardoEntity fardo = fardoRepository.findById(request.getFardoId())
                .orElseThrow(() -> new ResourceNotFoundException("Fardo não encontrado com ID: " + request.getFardoId()));
        entrega.setFardoEntity(fardo);

        EntregadorEntity entregador = entregadorRepository.findById(request.getEntregadorId())
                .orElseThrow(() -> new ResourceNotFoundException("Entregador não encontrado com ID: " + request.getEntregadorId()));
        entrega.setEntregadorEntity(entregador);

        return toResponse(entregaRepository.save(entrega));
    }

    public EntregaResponse update(Long id, EntregaRequest request) {
        EntregaEntity entrega = entregaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entrega não encontrada com ID: " + id));

        entrega.setDataEntrega(request.getDataEntrega());
        entrega.setStatus(request.getStatus());
        entrega.setObservacao(request.getObservacao());

        FardoEntity fardo = fardoRepository.findById(request.getFardoId())
                .orElseThrow(() -> new ResourceNotFoundException("Fardo não encontrado com ID: " + request.getFardoId()));
        entrega.setFardoEntity(fardo);

        EntregadorEntity entregador = entregadorRepository.findById(request.getEntregadorId())
                .orElseThrow(() -> new ResourceNotFoundException("Entregador não encontrado com ID: " + request.getEntregadorId()));
        entrega.setEntregadorEntity(entregador);

        return toResponse(entregaRepository.save(entrega));
    }

    public void delete(Long id) {
        EntregaEntity entrega = entregaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entrega não encontrada com ID: " + id));
        entregaRepository.delete(entrega);
    }

    public EntregaResponse toResponse(EntregaEntity entity) {
        if (entity == null) return null;
        EntregaResponse response = new EntregaResponse();
        response.setId(entity.getId());
        response.setDataEntrega(entity.getDataEntrega());
        response.setStatus(entity.getStatus());
        response.setObservacao(entity.getObservacao());

        if (entity.getFardoEntity() != null) {
            FardoResponse fr = fardoService.toResponse(entity.getFardoEntity());
            response.setFardoResponse(fr);
        }

        if (entity.getEntregadorEntity() != null) {
            EntregadorEntity entregador = entity.getEntregadorEntity();
            EntregadorResponse er = new EntregadorResponse();
            er.setId(entregador.getId());
            er.setNome(entregador.getNome());
            er.setTelefone(entregador.getTelefone());
            response.setEntregadorResponse(er);
        }

        return response;
    }
}
