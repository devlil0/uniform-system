package com.devlil0.sistemadeuniformes.controller;

import com.devlil0.sistemadeuniformes.dto.request.ItemPedidoRequest;
import com.devlil0.sistemadeuniformes.dto.response.ItemPedidoResponse;
import com.devlil0.sistemadeuniformes.service.ItemPedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/item-pedido")
@RequiredArgsConstructor
public class ItemPedidoController {

    private final ItemPedidoService itemPedidoService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ItemPedidoResponse> findAll() {
        return itemPedidoService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ItemPedidoResponse findById(@PathVariable Long id) {
        return itemPedidoService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ItemPedidoResponse create(@Valid @RequestBody ItemPedidoRequest request) {
        return itemPedidoService.create(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ItemPedidoResponse update(@PathVariable Long id, @Valid @RequestBody ItemPedidoRequest request) {
        return itemPedidoService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        itemPedidoService.delete(id);
    }
}
