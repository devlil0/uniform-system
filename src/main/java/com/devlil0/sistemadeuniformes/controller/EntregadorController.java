package com.devlil0.sistemadeuniformes.controller;

import com.devlil0.sistemadeuniformes.dto.request.EntregadorRequest;
import com.devlil0.sistemadeuniformes.dto.response.EntregadorResponse;
import com.devlil0.sistemadeuniformes.service.EntregadorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entregador")
@RequiredArgsConstructor
public class EntregadorController {

    private final EntregadorService entregadorService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<EntregadorResponse> findAll() {
        return entregadorService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public EntregadorResponse findById(@PathVariable Long id) {
        return entregadorService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EntregadorResponse create(@Valid @RequestBody EntregadorRequest request) {
        return entregadorService.create(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public EntregadorResponse update(@PathVariable Long id, @Valid @RequestBody EntregadorRequest request) {
        return entregadorService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        entregadorService.delete(id);
    }
}
