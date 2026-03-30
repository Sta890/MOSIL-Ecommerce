package com.mosilshop.service;

import com.mosilshop.entity.*;
import com.mosilshop.enums.OrderStatus;
import com.mosilshop.repository.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartService cartService;
    private final ProductRepository productRepository; // ← ajouter
    private final EmailService emailService;

    public List<Order> getUserOrders(Long userId) {
        if (userId == null) return orderRepository.findAll();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Transactional
    public Order createOrder(Long userId, CheckoutRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = cartService.getCartByUserId(userId);

        if (cart.getItems().isEmpty()) throw new RuntimeException("Cart is empty");

        // ✅ 1. Vérification stock avant commande
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (cartItem.getQuantity() > product.getStock()) {
                throw new RuntimeException(
                        "Stock insuffisant pour " + product.getName() +
                                ". Stock disponible: " + product.getStock() +
                                ", quantité demandée: " + cartItem.getQuantity()
                );
            }
        }

        BigDecimal subtotal = cart.getItems().stream()
                .map(i -> i.getProduct().getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal shipping = subtotal.compareTo(BigDecimal.valueOf(100)) >= 0
                ? BigDecimal.ZERO : BigDecimal.valueOf(9.99);

        BigDecimal discount = BigDecimal.ZERO;
        if ("SAVE10".equalsIgnoreCase(request.getPromoCode())) discount = subtotal.multiply(BigDecimal.valueOf(0.10));
        else if ("WELCOME20".equalsIgnoreCase(request.getPromoCode())) discount = subtotal.multiply(BigDecimal.valueOf(0.20));

        BigDecimal total = subtotal.add(shipping).subtract(discount);

        Order order = Order.builder()
                .orderNumber("MSL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .user(user)
                .subtotal(subtotal)
                .shippingCost(shipping)
                .discountAmount(discount)
                .total(total)
                .promoCode(request.getPromoCode())
                .status(OrderStatus.PENDING)
                .shippingFirstName(request.getFirstName())
                .shippingLastName(request.getLastName())
                .shippingEmail(request.getEmail())
                .shippingAddress(request.getAddress())
                .shippingCity(request.getCity())
                .shippingZip(request.getZip())
                .shippingCountry(request.getCountry())
                .build();

        List<OrderItem> items = cart.getItems().stream().map(cartItem -> OrderItem.builder()
                .order(order)
                .product(cartItem.getProduct())
                .quantity(cartItem.getQuantity())
                .unitPrice(cartItem.getProduct().getPrice())
                .totalPrice(cartItem.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                .selectedSize(cartItem.getSelectedSize())
                .selectedColor(cartItem.getSelectedColor())
                .build()).collect(Collectors.toList());

        order.setItems(items);
        Order saved = orderRepository.save(order);

        // ✅ 2. Déstockage automatique après commande
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        cartService.clearCart(userId);
        return saved;
    }

    public Order updateStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(OrderStatus.valueOf(status));
        return orderRepository.save(order);
    }
    public Order updateStatusByOrderNumber(String orderNumber, String status) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderNumber));
        order.setStatus(OrderStatus.valueOf(status));

        // ✅ Envoie l'email de confirmation après paiement MTN/Orange
        if ("CONFIRMED".equals(status)) {
            emailService.sendOrderConfirmation(
                    order.getShippingEmail(),        // destinataire
                    order.getShippingFirstName(),    // prénom
                    order.getOrderNumber(),          // numéro commande
                    order.getTotal()                 // montant total
            );
        }
        return orderRepository.save(order);
    }

    @Data
    public static class CheckoutRequest {
        private String firstName, lastName, email, phone;
        private String address, city, zip, country;
        private String promoCode;
    }
}