package com.mosilshop.controller;

import com.mosilshop.entity.Cart;
import com.mosilshop.entity.User;
import com.mosilshop.repository.UserRepository;
import com.mosilshop.service.CartService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(cartService.getCartByUserId(getUserId(userDetails)));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addItem(@AuthenticationPrincipal UserDetails userDetails,
                                        @RequestBody AddItemRequest request) {
        return ResponseEntity.ok(cartService.addItem(
                getUserId(userDetails), request.getProductId(),
                request.getSize(), request.getColor(), request.getQuantity()));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<Cart> updateItem(@AuthenticationPrincipal UserDetails userDetails,
                                           @PathVariable Long itemId,
                                           @RequestBody UpdateItemRequest request) {
        return ResponseEntity.ok(cartService.updateItem(getUserId(userDetails), itemId, request.getQuantity()));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Cart> removeItem(@AuthenticationPrincipal UserDetails userDetails,
                                           @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeItem(getUserId(userDetails), itemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(getUserId(userDetails));
        return ResponseEntity.noContent().build();
    }

    @Data static class AddItemRequest {
        private Long productId;
        private String size;
        private String color;
        private int quantity = 1;
    }

    @Data static class UpdateItemRequest {
        private int quantity;
    }
}
