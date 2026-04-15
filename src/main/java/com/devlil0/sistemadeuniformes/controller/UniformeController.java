package com.devlil0.sistemadeuniformes.controller;

import com.devlil0.sistemadeuniformes.dto.request.UniformeRequest;
import com.devlil0.sistemadeuniformes.dto.response.UniformeResponse;
import com.devlil0.sistemadeuniformes.service.UniformeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/uniforme")
@RequiredArgsConstructor
public class UniformeController {

    private final UniformeService uniformeService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<UniformeResponse> findAll() {
        return uniformeService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UniformeResponse findById(@PathVariable Long id) {
        return uniformeService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UniformeResponse create(@Valid @RequestBody UniformeRequest request) {
        return uniformeService.create(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UniformeResponse update(@PathVariable Long id, @Valid @RequestBody UniformeRequest request) {
        return uniformeService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        uniformeService.delete(id);
    }
}
