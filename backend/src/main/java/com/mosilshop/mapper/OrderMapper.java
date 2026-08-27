package com.mosilshop.mapper;

import com.mosilshop.dto.OrderDTO;
import com.mosilshop.entity.Order;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public OrderDTO toDTO(Order order) {
        return OrderDTO.from(order);
    }

    public List<OrderDTO> toDTOList(List<Order> orders) {
        return orders.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}