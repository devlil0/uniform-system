package com.devlil0.sistemadeuniformes.service;

import com.devlil0.sistemadeuniformes.dto.request.ProducaoRequest;
import com.devlil0.sistemadeuniformes.dto.response.ClienteResponse;
import com.devlil0.sistemadeuniformes.dto.response.CostureiraResponse;
import com.devlil0.sistemadeuniformes.dto.response.PedidoResponse;
import com.devlil0.sistemadeuniformes.dto.response.ProducaoResponse;
import com.devlil0.sistemadeuniformes.enums.EtapaProducao;
import com.devlil0.sistemadeuniformes.enums.StatusPedido;
import com.devlil0.sistemadeuniformes.exception.ResourceNotFoundException;
import com.devlil0.sistemadeuniformes.model.CostureiraEntity;
import com.devlil0.sistemadeuniformes.model.PedidoEntity;
import com.devlil0.sistemadeuniformes.model.ProducaoEntity;
import com.devlil0.sistemadeuniformes.repository.CostureiraRepository;
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
public class ProducaoService {

    private final ProducaoRepository producaoRepository;
    private final PedidoRepository pedidoRepository;
    private final CostureiraRepository costureiraRepository;

    public List<ProducaoResponse> findAll() {
        return producaoRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProducaoResponse findById(Long id) {
        ProducaoEntity producao = producaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produção não encontrada com ID: " + id));
        return toResponse(producao);
    }

    public ProducaoResponse create(ProducaoRequest request) {
        if (request.getPedidoId() != null &&
            producaoRepository.existsByPedidoEntity_IdAndEtapaNot(request.getPedidoId(), EtapaProducao.DESPACHADO)) {
            throw new IllegalStateException("Este pedido já possui um registro de produção ativo.");
        }

        ProducaoEntity producao = new ProducaoEntity();
        producao.setEtapa(request.getEtapa());
        producao.setEntrada(request.getEntrada());
        producao.setSaida(request.getSaida());

        if (request.getPedidoId() != null) {
            PedidoEntity pedido = pedidoRepository.findById(request.getPedidoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com ID: " + request.getPedidoId()));
            producao.setPedidoEntity(pedido);
        }
        
        if (request.getCostureiraId() != null) {
            CostureiraEntity costureira = costureiraRepository.findById(request.getCostureiraId())
                    .orElseThrow(() -> new ResourceNotFoundException("Costureira não encontrada com ID: " + request.getCostureiraId()));
            producao.setCostureiraEntity(costureira);
        }
        
        ProducaoEntity saved = producaoRepository.save(producao);
        atualizarStatusPedido(saved.getPedidoEntity(), saved.getEtapa());
        return toResponse(saved);
    }

    public ProducaoResponse update(Long id, ProducaoRequest request) {
        ProducaoEntity producao = producaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produção não encontrada com ID: " + id));
        
        producao.setEtapa(request.getEtapa());
        producao.setEntrada(request.getEntrada());
        producao.setSaida(request.getSaida());
        
        if (request.getPedidoId() != null) {
            PedidoEntity pedido = pedidoRepository.findById(request.getPedidoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com ID: " + request.getPedidoId()));
            producao.setPedidoEntity(pedido);
        }
        
        if (request.getCostureiraId() != null) {
            CostureiraEntity costureira = costureiraRepository.findById(request.getCostureiraId())
                    .orElseThrow(() -> new ResourceNotFoundException("Costureira não encontrada com ID: " + request.getCostureiraId()));
            producao.setCostureiraEntity(costureira);
        }
        
        ProducaoEntity saved = producaoRepository.save(producao);
        atualizarStatusPedido(saved.getPedidoEntity(), saved.getEtapa());
        return toResponse(saved);
    }

    private void atualizarStatusPedido(PedidoEntity pedido, EtapaProducao etapa) {
        if (pedido == null || etapa == null) return;
        if (etapa == EtapaProducao.CORTE) {
            pedido.setStatus(StatusPedido.EM_PRODUCAO);
            pedidoRepository.save(pedido);
        } else if (etapa == EtapaProducao.DESPACHADO) {
            pedido.setStatus(StatusPedido.FINALIZADO);
            pedidoRepository.save(pedido);
        }
    }

    public void delete(Long id) {
        ProducaoEntity producao = producaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produção não encontrada com ID: " + id));
        producaoRepository.delete(producao);
    }

    public ProducaoResponse toResponse(ProducaoEntity entity) {
        if (entity == null) return null;
        ProducaoResponse response = new ProducaoResponse();
        response.setId(entity.getId());
        response.setEtapa(entity.getEtapa());
        response.setEntrada(entity.getEntrada());
        response.setSaida(entity.getSaida());
        
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
        
        if (entity.getCostureiraEntity() != null) {
            CostureiraEntity c = entity.getCostureiraEntity();
            response.setCostureiraResponse(CostureiraResponse.builder()
                    .id(c.getId())
                    .nome(c.getNome())
                    .telefone(c.getTelefone())
                    .build());
        }
        
        return response;
    }
}
