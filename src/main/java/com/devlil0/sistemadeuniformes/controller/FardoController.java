package com.devlil0.sistemadeuniformes.controller;

import com.devlil0.sistemadeuniformes.dto.request.FardoRequest;
import com.devlil0.sistemadeuniformes.dto.response.FardoResponse;
import com.devlil0.sistemadeuniformes.service.FardoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fardo")
@RequiredArgsConstructor
public class FardoController {

    private final FardoService fardoService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<FardoResponse> findAll() {
        return fardoService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public FardoResponse findById(@PathVariable Long id) {
        return fardoService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FardoResponse create(@Valid @RequestBody FardoRequest request) {
        return fardoService.create(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public FardoResponse update(@PathVariable Long id, @Valid @RequestBody FardoRequest request) {
        return fardoService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        fardoService.delete(id);
    }
}
