package com.mosilshop.dto;

import com.mosilshop.entity.Product;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String brand;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String category;
    private String type;
    private String description;
    private Integer stock;
    private Double rating;
    private Integer reviewCount;
    private Boolean isNew;
    private Boolean isSale;
    private String sizes;
    private String colors;
    private String images;
    private String tags;
    private LocalDateTime createdAt;

    public static ProductDTO from(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setBrand(product.getBrand());
        dto.setPrice(product.getPrice());
        dto.setOriginalPrice(product.getOriginalPrice());
        dto.setCategory(product.getCategory().name());
        dto.setType(product.getType().name());
        dto.setDescription(product.getDescription());
        dto.setStock(product.getStock());
        dto.setRating(product.getRating());
        dto.setReviewCount(product.getReviewCount());
        dto.setIsNew(product.getIsNew());
        dto.setIsSale(product.getIsSale());
        dto.setSizes(product.getSizes());
        dto.setColors(product.getColors());
        dto.setImages(product.getImages());
        dto.setTags(product.getTags());
        dto.setCreatedAt(product.getCreatedAt());
        return dto;
    }
}