package com.devlil0.sistemadeuniformes.controller;

import com.devlil0.sistemadeuniformes.dto.request.PedidoRequest;
import com.devlil0.sistemadeuniformes.dto.response.PedidoResponse;
import com.devlil0.sistemadeuniformes.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedido")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<PedidoResponse> findAll() {
        return pedidoService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PedidoResponse findById(@PathVariable Long id) {
        return pedidoService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoResponse create(@Valid @RequestBody PedidoRequest request) {
        return pedidoService.create(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PedidoResponse update(@PathVariable Long id, @Valid @RequestBody PedidoRequest request) {
        return pedidoService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        pedidoService.delete(id);
    }
}
