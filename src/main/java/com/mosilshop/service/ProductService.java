package com.mosilshop.service;

import com.mosilshop.entity.Product;
import com.mosilshop.enums.Category;
import com.mosilshop.enums.ProductType;
import com.mosilshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() { return productRepository.findAll(); }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public List<Product> getByCategory(String category) {
        return productRepository.findByCategory(Category.valueOf(category));
    }

    public List<Product> getByType(String type) {
        return productRepository.findByType(ProductType.valueOf(type));
    }

    public List<Product> getNewArrivals() { return productRepository.findByIsNewTrue(); }

    public List<Product> getSaleItems() { return productRepository.findByIsSaleTrue(); }

    public List<Product> getTopRated() { return productRepository.findTopRated(); }

    public List<Product> search(String query) { return productRepository.searchProducts(query); }

    public Product create(Product product) { return productRepository.save(product); }

    public Product update(Long id, Product updated) {
        Product existing = getById(id);
        existing.setName(updated.getName());
        existing.setBrand(updated.getBrand());
        existing.setPrice(updated.getPrice());
        existing.setOriginalPrice(updated.getOriginalPrice());
        existing.setDescription(updated.getDescription());
        existing.setStock(updated.getStock());
        existing.setCategory(updated.getCategory());
        existing.setType(updated.getType());
        existing.setSizes(updated.getSizes());
        existing.setColors(updated.getColors());
        existing.setImages(updated.getImages());
        existing.setTags(updated.getTags());
        existing.setIsNew(updated.getIsNew());
        existing.setIsSale(updated.getIsSale());
        return productRepository.save(existing);
    }

    public void delete(Long id) { productRepository.deleteById(id); }
}
