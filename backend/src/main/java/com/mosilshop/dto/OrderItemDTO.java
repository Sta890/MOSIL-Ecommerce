package com.mosilshop.dto;

import com.mosilshop.entity.OrderItem;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private String selectedSize;
    private String selectedColor;

    public static OrderItemDTO from(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductImage(item.getProduct().getImages() != null ?
                item.getProduct().getImages().split(",")[0] : null);
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setTotalPrice(item.getTotalPrice());
        dto.setSelectedSize(item.getSelectedSize());
        dto.setSelectedColor(item.getSelectedColor());
        return dto;
    }
}