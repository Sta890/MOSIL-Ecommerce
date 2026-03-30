package com.mosilshop.controller;

import com.mosilshop.dto.UserDTO;
import com.mosilshop.entity.User;
import com.mosilshop.enums.Role;
import com.mosilshop.mapper.UserMapper;
import com.mosilshop.repository.OrderRepository;
import com.mosilshop.repository.ProductRepository;
import com.mosilshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class DashboardController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final UserMapper userMapper;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalOrders", orderRepository.countAllOrders());
        stats.put("totalRevenue", orderRepository.getTotalRevenue());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProducts", productRepository.count());
        stats.put("pendingOrders", orderRepository.countPendingOrders());
        stats.put("deliveredOrders", orderRepository.countDeliveredOrders());

        List<Object[]> byStatus = orderRepository.countByStatus();
        Map<String, Long> statusMap = new HashMap<>();
        for (Object[] row : byStatus) {
            statusMap.put(row[0].toString(), (Long) row[1]);
        }
        stats.put("ordersByStatus", statusMap);

        List<Object[]> daily = orderRepository.getDailyRevenue();
        List<Map<String, Object>> dailyList = daily.stream().map(row -> {
            Map<String, Object> d = new HashMap<>();
            d.put("date", row[0].toString());
            d.put("revenue", row[1]);
            return d;
        }).toList();
        stats.put("dailyRevenue", dailyList);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userMapper.toDTOList(userRepository.findAll()));
    }

    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(Role.valueOf(role));
        return ResponseEntity.ok(userMapper.toDTO(userRepository.save(user)));
    }
}