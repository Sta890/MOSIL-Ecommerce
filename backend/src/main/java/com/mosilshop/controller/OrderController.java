package com.mosilshop.controller;

import com.mosilshop.dto.OrderDTO;
import com.mosilshop.entity.Order;
import com.mosilshop.mapper.OrderMapper;
import com.mosilshop.repository.OrderRepository;
import com.mosilshop.repository.UserRepository;
import com.mosilshop.service.FactureService;
import com.mosilshop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;
    private final FactureService factureService;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(orderMapper.toDTOList(orderService.getUserOrders(getUserId(userDetails))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderMapper.toDTO(orderService.getOrderById(id)));
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderDTO> checkout(@AuthenticationPrincipal UserDetails userDetails,
                                             @RequestBody OrderService.CheckoutRequest request) {
        return ResponseEntity.ok(orderMapper.toDTO(orderService.createOrder(getUserId(userDetails), request)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(orderMapper.toDTO(orderService.updateStatus(id, status)));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderMapper.toDTOList(orderService.getUserOrders(null)));
    }

    @GetMapping("/{id}/facture")
    public ResponseEntity<byte[]> telechargerFacture(@PathVariable Long id) {
        try {
            System.out.println("Endpoint appelé avec id = " + id);
            Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Commande introuvable"));
            byte[] pdf = factureService.genererFacturePDF(order);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData(
                    "attachment", "facture-" + order.getOrderNumber() + ".pdf");
            return ResponseEntity.ok().headers(headers).body(pdf);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur génération PDF", e);
        }
    }
}