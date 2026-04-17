package com.devlil0.sistemadeuniformes.controller;

import com.devlil0.sistemadeuniformes.dto.request.ProducaoRequest;
import com.devlil0.sistemadeuniformes.dto.response.ProducaoResponse;
import com.devlil0.sistemadeuniformes.service.ProducaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/producao")
@RequiredArgsConstructor
public class ProducaoController {

    private final ProducaoService producaoService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ProducaoResponse> findAll() {
        return producaoService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProducaoResponse findById(@PathVariable Long id) {
        return producaoService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProducaoResponse create(@Valid @RequestBody ProducaoRequest request) {
        return producaoService.create(request);
    }

    @PutMapping("/" +
            "" +
            "1{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProducaoResponse update(@PathVariable Long id, @Valid @RequestBody ProducaoRequest request) {
        return producaoService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        producaoService.delete(id);
    }
}
