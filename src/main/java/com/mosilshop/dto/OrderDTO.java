package com.mosilshop.dto;

import com.mosilshop.entity.Order;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private String status;
    private BigDecimal subtotal;
    private BigDecimal shippingCost;
    private BigDecimal discountAmount;
    private BigDecimal total;
    private String promoCode;
    private String shippingFirstName;
    private String shippingLastName;
    private String shippingEmail;
    private String shippingAddress;
    private String shippingCity;
    private String shippingZip;
    private String shippingCountry;
    private String shippingPhone;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items;
    private UserDTO user;

    public static OrderDTO from(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setStatus(order.getStatus().name());
        dto.setSubtotal(order.getSubtotal());
        dto.setShippingCost(order.getShippingCost());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setTotal(order.getTotal());
        dto.setPromoCode(order.getPromoCode());
        dto.setShippingFirstName(order.getShippingFirstName());
        dto.setShippingLastName(order.getShippingLastName());
        dto.setShippingEmail(order.getShippingEmail());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setShippingCity(order.getShippingCity());
        dto.setShippingZip(order.getShippingZip());
        dto.setShippingCountry(order.getShippingCountry());
        dto.setShippingPhone(order.getShippingPhone());
        dto.setCreatedAt(order.getCreatedAt());
        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream()
                    .map(OrderItemDTO::from)
                    .collect(Collectors.toList()));
        }
        if (order.getUser() != null) {
            dto.setUser(UserDTO.from(order.getUser()));
        }
        return dto;
    }
}
