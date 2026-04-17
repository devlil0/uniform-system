package com.devlil0.sistemadeuniformes.service;

import com.devlil0.sistemadeuniformes.dto.request.FardoRequest;
import com.devlil0.sistemadeuniformes.dto.response.ClienteResponse;
import com.devlil0.sistemadeuniformes.dto.response.FardoResponse;
import com.devlil0.sistemadeuniformes.dto.response.PedidoResponse;
import com.devlil0.sistemadeuniformes.enums.EtapaProducao;
import com.devlil0.sistemadeuniformes.exception.ResourceNotFoundException;
import com.devlil0.sistemadeuniformes.model.FardoEntity;
import com.devlil0.sistemadeuniformes.model.PedidoEntity;
import com.devlil0.sistemadeuniformes.repository.FardoRepository;
import com.devlil0.sistemadeuniformes.repository.PedidoRepository;
import com.devlil0.sistemadeuniformes.repository.ProducaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FardoService {

    private final FardoRepository fardoRepository;
    private final PedidoRepository pedidoRepository;
    private final ProducaoRepository producaoRepository;

    public List<FardoResponse> findAll() {
        return fardoRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public FardoResponse findById(Long id) {
        FardoEntity fardo = fardoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fardo não encontrado com ID: " + id));
        return toResponse(fardo);
    }

    public FardoResponse create(FardoRequest request) {
        boolean despachado = producaoRepository.existsByPedidoEntity_IdAndEtapa(
                request.getPedidoId(), EtapaProducao.DESPACHADO);
        if (!despachado) {
            throw new IllegalStateException(
                    "O pedido precisa ter a etapa DESPACHADO registrada antes de criar um fardo.");
        }

        FardoEntity fardo = new FardoEntity();
        fardo.setDataEnvio(request.getDataEnvio());

        if (request.getPedidoId() != null) {
            PedidoEntity pedido = pedidoRepository.findById(request.getPedidoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com ID: " + request.getPedidoId()));
            fardo.setPedidoEntity(pedido);
        }

        return toResponse(fardoRepository.save(fardo));
    }

    public FardoResponse update(Long id, FardoRequest request) {
        FardoEntity fardo = fardoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fardo não encontrado com ID: " + id));
        
        fardo.setDataEnvio(request.getDataEnvio());
        
        if (request.getPedidoId() != null) {
            PedidoEntity pedido = pedidoRepository.findById(request.getPedidoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com ID: " + request.getPedidoId()));
            fardo.setPedidoEntity(pedido);
        }

        return toResponse(fardoRepository.save(fardo));
    }

    public void delete(Long id) {
        FardoEntity fardo = fardoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fardo não encontrado com ID: " + id));
        fardoRepository.delete(fardo);
    }

    public FardoResponse toResponse(FardoEntity entity) {
        if (entity == null) return null;
        FardoResponse response = new FardoResponse();
        response.setId(entity.getId());
        response.setDataEnvio(entity.getDataEnvio());
        
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

        return response;
    }
}
