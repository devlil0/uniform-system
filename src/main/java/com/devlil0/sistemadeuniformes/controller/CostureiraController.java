package com.devlil0.sistemadeuniformes.controller;

import com.devlil0.sistemadeuniformes.dto.request.CostureiraRequest;
import com.devlil0.sistemadeuniformes.dto.response.CostureiraResponse;
import com.devlil0.sistemadeuniformes.service.CostureiraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/costureira")
@RequiredArgsConstructor
public class CostureiraController {

    private final CostureiraService costureiraService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<CostureiraResponse> findAll() {
        return costureiraService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public CostureiraResponse findById(@PathVariable Long id) {
        return costureiraService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CostureiraResponse create(@Valid @RequestBody CostureiraRequest request) {
        return costureiraService.create(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public CostureiraResponse update(@PathVariable Long id, @Valid @RequestBody CostureiraRequest request) {
        return costureiraService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        costureiraService.delete(id);
    }
}
