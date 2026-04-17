package com.devlil0.sistemadeuniformes.controller;

import com.devlil0.sistemadeuniformes.dto.request.EntregaRequest;
import com.devlil0.sistemadeuniformes.dto.response.EntregaResponse;
import com.devlil0.sistemadeuniformes.service.EntregaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entrega")
@RequiredArgsConstructor
public class EntregaController {

    private final EntregaService entregaService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<EntregaResponse> findAll() {
        return entregaService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public EntregaResponse findById(@PathVariable Long id) {
        return entregaService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EntregaResponse create(@Valid @RequestBody EntregaRequest request) {
        return entregaService.create(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public EntregaResponse update(@PathVariable Long id, @Valid @RequestBody EntregaRequest request) {
        return entregaService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        entregaService.delete(id);
    }
}
