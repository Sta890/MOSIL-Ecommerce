package com.mosilshop.controller;

import com.mosilshop.dto.ProductDTO;
import com.mosilshop.entity.Product;
import com.mosilshop.mapper.ProductMapper;
import com.mosilshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductMapper productMapper;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search) {

        if (search != null) return ResponseEntity.ok(productMapper.toDTOList(productService.search(search)));
        if (category != null && type != null)
            return ResponseEntity.ok(productMapper.toDTOList(productService.getByCategory(category)));
        if (category != null) return ResponseEntity.ok(productMapper.toDTOList(productService.getByCategory(category)));
        if (type != null) return ResponseEntity.ok(productMapper.toDTOList(productService.getByType(type)));
        return ResponseEntity.ok(productMapper.toDTOList(productService.getAllProducts()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productMapper.toDTO(productService.getById(id)));
    }

    @GetMapping("/new-arrivals")
    public ResponseEntity<List<ProductDTO>> getNewArrivals() {
        return ResponseEntity.ok(productMapper.toDTOList(productService.getNewArrivals()));
    }

    @GetMapping("/sale")
    public ResponseEntity<List<ProductDTO>> getSale() {
        return ResponseEntity.ok(productMapper.toDTOList(productService.getSaleItems()));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<ProductDTO>> getTopRated() {
        return ResponseEntity.ok(productMapper.toDTOList(productService.getTopRated()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> create(@RequestBody Product product) {
        return ResponseEntity.ok(productMapper.toDTO(productService.create(product)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> update(@PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(productMapper.toDTO(productService.update(id, product)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}