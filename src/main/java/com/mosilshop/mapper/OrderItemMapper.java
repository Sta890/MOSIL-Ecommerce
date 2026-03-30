package com.mosilshop.mapper;

import com.mosilshop.dto.OrderItemDTO;
import com.mosilshop.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderItemMapper {

    public OrderItemDTO toDTO(OrderItem item) {
        return OrderItemDTO.from(item);
    }

    public List<OrderItemDTO> toDTOList(List<OrderItem> items) {
        return items.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}