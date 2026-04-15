package com.devlil0.sistemadeuniformes.controller;

import com.devlil0.sistemadeuniformes.dto.request.EstoqueRequest;
import com.devlil0.sistemadeuniformes.dto.response.EstoqueResponse;
import com.devlil0.sistemadeuniformes.service.EstoqueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estoque")
@RequiredArgsConstructor
public class EstoqueController {

    private final EstoqueService estoqueService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<EstoqueResponse> findAll() {
        return estoqueService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public EstoqueResponse findById(@PathVariable Long id) {
        return estoqueService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EstoqueResponse create(@Valid @RequestBody EstoqueRequest request) {
        return estoqueService.create(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public EstoqueResponse update(@PathVariable Long id, @Valid @RequestBody EstoqueRequest request) {
        return estoqueService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        estoqueService.delete(id);
    }
}
